import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import {
  useGetOrganizationMembersQuery,
  useAddOrganizationMemberMutation,
  useUpdateOrganizationMemberMutation,
  useRemoveOrganizationMemberMutation,
  type Organization,
  type User,
} from "@/redux/features/platform/platformApi";
import {
  UserPlus,
  Trash2,
  Edit,
  Search,
  Shield,
  ShieldCheck,
  Crown,
  Loader2,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";

interface ManageMembersDialogProps {
  organization: Organization | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const addMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Member", "Admin", "SuperAdmin"]),
  isOrganizationAdmin: z.boolean(),
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
      role: "Member",
      isOrganizationAdmin: false,
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
      isOrganizationAdmin?: boolean;
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
    if (user.isOrganizationOwner) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (user.isOrganizationAdmin) return <ShieldCheck className="h-4 w-4 text-blue-500" />;
    return <Shield className="h-4 w-4 text-gray-500" />;
  };

  const getRoleBadge = (user: User) => {
    if (user.isOrganizationOwner) {
      return <Badge className="bg-yellow-500">Owner</Badge>;
    }
    if (user.isOrganizationAdmin) {
      return <Badge className="bg-blue-500">Org Admin</Badge>;
    }
    return <Badge variant="outline">{user.role}</Badge>;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Members - {organization?.name}</DialogTitle>
            <DialogDescription>
              Add, edit, or remove members from this organization
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Add Member Form */}
            {showAddForm && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold mb-4">Add New Member</h3>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleAddMember)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
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
                            <FormLabel>Role</FormLabel>
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
                                <SelectItem value="Member">Member</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="isOrganizationAdmin"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Organization Administrator
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Can manage organization settings and members
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isAdding}>
                        {isAdding && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Add Member
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
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
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(member)}
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{getRoleBadge(member)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              member.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!member.isOrganizationOwner && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingMember(member)}
                                  disabled={isUpdating}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setMemberToDelete(member)}
                                  disabled={isRemoving}
                                  className="text-red-600 hover:text-red-700"
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
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * 10 + 1} to{" "}
                  {Math.min(page * 10, data.meta.total)} of {data.meta.total}{" "}
                  members
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Member</AlertDialogTitle>
              <AlertDialogDescription>
                Update role and permissions for {editingMember.name}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Role</label>
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
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="orgAdmin"
                  checked={editingMember.isOrganizationAdmin}
                  onCheckedChange={(checked) => {
                    handleUpdateMember(editingMember._id, {
                      isOrganizationAdmin: checked as boolean,
                    });
                  }}
                />
                <label
                  htmlFor="orgAdmin"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Organization Administrator
                </label>
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {memberToDelete.name} from this
                organization? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveMember}
                className="bg-red-600 hover:bg-red-700"
                disabled={isRemoving}
              >
                {isRemoving && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
