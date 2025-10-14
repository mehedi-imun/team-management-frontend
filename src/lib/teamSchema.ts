import { z } from "zod";

export const teamSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Team Name is required"),
  manager: z.string().min(1, "Manager is required"),
  director: z.string().min(1, "Director is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["0", "1", "-1"]), // required now
  members: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Member Name is required"),
      position: z.string().min(1, "Position is required"),
      email: z.string().email("Invalid email"),
    })
  ),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
