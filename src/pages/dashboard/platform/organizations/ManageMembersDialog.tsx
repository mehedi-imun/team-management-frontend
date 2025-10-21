import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  useAddOrganizationMemberMutation,
  useGetOrganizationMembersQuery,
  useRemoveOrganizationMemberMutation,
  useUpdateOrganizationMemberMutation,
  type Organization,
  type User,
} from "@/redux/features/platform/platformApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Crown,
  Edit,
  Loader2,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ManageMembersDialogProps {
  organization: Organization | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const addMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["OrgMember", "OrgAdmin", "OrgOwner"]),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AddMemberForm = z.infer<typeof addMemberSchema>;

export function ManageMembersDialog({
  organization,
  open,
  onOpenChange,
}: ManageMembersDialogProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<User | null>(null);

  // Queries and mutations
  const { data, isLoading, refetch } = useGetOrganizationMembersQuery(
    {
      organizationId: organization?._id || "",
      page,
      limit: 10,
      search,
    },
    { skip: !organization?._id }
  );

  const [addMember, { isLoading: isAdding }] =
    useAddOrganizationMemberMutation();
  const [updateMember, { isLoading: isUpdating }] =
    useUpdateOrganizationMemberMutation();
  const [removeMember, { isLoading: isRemoving }] =
    useRemoveOrganizationMemberMutation();

  // Form for adding member
  const form = useForm<AddMemberForm>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "OrgMember",
      password: "",
    },
  });

  const handleAddMember = async (values: AddMemberForm) => {
    if (!organization) return;

    try {
      await addMember({
        organizationId: organization._id,
        ...values,
      }).unwrap();

      toast({
        title: "Success",
        description: "Member added successfully",
      });

      form.reset();
      setShowAddForm(false);
      refetch();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to add member",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMember = async (
    userId: string,
    updates: {
      role?: string;
      isActive?: boolean;
    }
  ) => {
    if (!organization) return;

    try {
      await updateMember({
        organizationId: organization._id,
        userId,
        ...updates,
      }).unwrap();

      toast({
        title: "Success",
        description: "Member updated successfully",
      });

      setEditingMember(null);
      refetch();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to update member",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async () => {
    if (!organization || !memberToDelete) return;

    try {
      await removeMember({
        organizationId: organization._id,
        userId: memberToDelete._id,
      }).unwrap();

      toast({
        title: "Success",
        description: "Member removed successfully",
      });

      setMemberToDelete(null);
      refetch();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (user: User) => {
    if (user.role === "OrgOwner")
      return <Crown className="h-4 w-4 text-yellow-500" />;
    if (user.role === "OrgAdmin")
      return <ShieldCheck className="h-4 w-4 text-blue-500" />;
    return <Shield className="h-4 w-4 text-gray-500" />;
  };

  const getRoleBadge = (user: User) => {
    const roleConfig: Record<
      string,
      { variant: string; label: string; className?: string }
    > = {
      OrgOwner: {
        variant: "default",
        label: "Owner",
        className: "bg-yellow-500 hover:bg-yellow-600 text-white",
      },
      OrgAdmin: {
        variant: "default",
        label: "Administrator",
        className: "bg-blue-500 hover:bg-blue-600 text-white",
      },
      OrgMember: {
        variant: "outline",
        label: "Member",
      },
    };

    const config = roleConfig[user.role] || {
      variant: "outline",
      label: user.role,
    };

    return (
      <Badge
        variant={config.variant as "default" | "outline"}
        className={config.className}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="h-6 w-6" />
              Manage Members - {organization?.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              Add, edit, or remove members from this organization. You can
              assign roles and manage permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Search members by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 text-base"
                />
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)} size="lg">
                <UserPlus className="h-5 w-5 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Add Member Form */}
            {showAddForm && (
              <div className="border-2 rounded-lg p-6 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-xl flex items-center gap-2">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                    Add New Member
                  </h3>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    They will receive login credentials via email
                  </Badge>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleAddMember)}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="OrgMember">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-gray-500" />
                                    <div>
                                      <div className="font-medium">Member</div>
                                      <div className="text-xs text-muted-foreground">
                                        View-only access
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="OrgAdmin">
                                  <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                                    <div>
                                      <div className="font-medium">
                                        Administrator
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Manage users & teams
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="OrgOwner">
                                  <div className="flex items-center gap-2">
                                    <Crown className="h-4 w-4 text-yellow-500" />
                                    <div>
                                      <div className="font-medium">Owner</div>
                                      <div className="text-xs text-muted-foreground">
                                        Full control + billing
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="submit" disabled={isAdding} size="lg">
                        {isAdding && (
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        )}
                        Add Member
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setShowAddForm(false);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {/* Members Table */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-3" />
                <p className="text-base text-muted-foreground">
                  Loading members...
                </p>
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 rounded-lg bg-gray-50">
                <UserPlus className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="font-semibold text-xl mb-2">No members found</h3>
                <p className="text-base text-muted-foreground mb-5">
                  {search
                    ? "Try adjusting your search query"
                    : "Get started by adding your first member"}
                </p>
                {!search && (
                  <Button onClick={() => setShowAddForm(true)} size="lg">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Add First Member
                  </Button>
                )}
              </div>
            ) : (
              <div className="border-2 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-base font-semibold">
                        Name
                      </TableHead>
                      <TableHead className="text-base font-semibold">
                        Email
                      </TableHead>
                      <TableHead className="text-base font-semibold">
                        Role
                      </TableHead>
                      <TableHead className="text-base font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-right text-base font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.map((member) => (
                      <TableRow key={member._id} className="hover:bg-gray-50">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            {getRoleIcon(member)}
                            <span className="font-medium text-base">
                              {member.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-base">
                          {member.email}
                        </TableCell>
                        <TableCell className="py-4">
                          {getRoleBadge(member)}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                member.isActive ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                            <span className="text-base">
                              {member.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end gap-2">
                            {member.role !== "OrgOwner" && (
                              <>
                                <Button
                                  size="default"
                                  variant="ghost"
                                  onClick={() => setEditingMember(member)}
                                  disabled={isUpdating}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="default"
                                  variant="ghost"
                                  onClick={() => setMemberToDelete(member)}
                                  disabled={isRemoving}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {data?.meta && data.meta.total > 10 && (
              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-base text-gray-600 font-medium">
                  Showing {(page - 1) * 10 + 1} to{" "}
                  {Math.min(page * 10, data.meta.total)} of {data.meta.total}{" "}
                  members
                </p>
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page * 10 >= data.meta.total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      {editingMember && (
        <AlertDialog
          open={!!editingMember}
          onOpenChange={() => setEditingMember(null)}
        >
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                Edit Member
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Update role and permissions for {editingMember.name}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Organization Role
                </label>
                <Select
                  defaultValue={editingMember.role}
                  onValueChange={(value) => {
                    handleUpdateMember(editingMember._id, { role: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OrgMember">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">Member</div>
                          <div className="text-xs text-muted-foreground">
                            View-only access
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="OrgAdmin">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">Administrator</div>
                          <div className="text-xs text-muted-foreground">
                            Manage users & teams
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="OrgOwner">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <div>
                          <div className="font-medium">Owner</div>
                          <div className="text-xs text-muted-foreground">
                            Full control + billing
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground mt-2">
                  {editingMember.role === "OrgOwner" &&
                    "⚠️ Owner has full access including billing management"}
                  {editingMember.role === "OrgAdmin" &&
                    "Admins can manage users and teams (no billing access)"}
                  {editingMember.role === "OrgMember" &&
                    "Members have read-only access"}
                </p>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm font-medium mb-2 block">
                  Account Status
                </label>
                <Select
                  defaultValue={editingMember.isActive ? "active" : "inactive"}
                  onValueChange={(value) => {
                    handleUpdateMember(editingMember._id, {
                      isActive: value === "active",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Active</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400" />
                        <span>Inactive</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog */}
      {memberToDelete && (
        <AlertDialog
          open={!!memberToDelete}
          onOpenChange={() => setMemberToDelete(null)}
        >
          <AlertDialogContent className="max-w-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                Remove Member
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-foreground">
                  {memberToDelete.name}
                </span>{" "}
                from this organization? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="text-base">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveMember}
                className="bg-red-600 hover:bg-red-700 text-base"
                disabled={isRemoving}
              >
                {isRemoving && (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                )}
                Remove Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
