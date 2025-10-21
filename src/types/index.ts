export interface IMember {
  _id?: string | null;
  userId?: string;
  name?: string;
  email: string;
  role?: string;
  status?: "pending" | "active" | "inactive"; // Member invitation/activation status
  joinedAt?: Date | string;
  invitedAt?: Date | string;
  isActive?: boolean; // Deprecated, use status instead
}

export interface ITeam {
  _id: string;
  name: string;
  description: string;
  status?: "0" | "1" | "-1";
  members: IMember[];
  managerApproved: "0" | "1" | "-1";
  directorApproved: "0" | "1" | "-1";
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type FormErrors = Record<string, string>;
