import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateOrganizationForClientMutation } from "@/redux/features/platform/platformApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Validation Schema
const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must not exceed 100 characters"),
  ownerEmail: z.string().email("Please enter a valid email address"),
  ownerName: z
    .string()
    .min(2, "Owner name must be at least 2 characters")
    .max(100, "Owner name must not exceed 100 characters"),
  plan: z.enum(["free", "professional", "business", "enterprise"]),
});

type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOrganizationDialog({
  open,
  onOpenChange,
}: CreateOrganizationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createOrganization] = useCreateOrganizationForClientMutation();

  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      ownerEmail: "",
      ownerName: "",
      plan: "free",
    },
  });

  const onSubmit = async (data: CreateOrganizationFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createOrganization(data).unwrap();

      toast.success(result.message || "Organization created successfully", {
        description: result.data.temporaryPassword
          ? `Temporary password: ${result.data.temporaryPassword}`
          : "Owner will receive setup instructions via email",
      });

      form.reset();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create organization. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization for a client. They will receive an email
            with setup instructions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Corporation"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the display name of the organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Full name of the organization owner
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@acme.com"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Owner will receive setup instructions at this email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Plan *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Free</span>
                          <span className="text-xs text-muted-foreground">
                            $0/month • 5 teams • 10 members
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="professional">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Professional</span>
                          <span className="text-xs text-muted-foreground">
                            $29/month • 50 teams • 100 members
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="business">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Business</span>
                          <span className="text-xs text-muted-foreground">
                            $99/month • 200 teams • 500 members
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="enterprise">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Enterprise</span>
                          <span className="text-xs text-muted-foreground">
                            Custom pricing • Unlimited • Unlimited
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the subscription plan for this organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Organization
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
