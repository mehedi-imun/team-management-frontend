export interface IMember {
  _id?: string | null;
  name: string;
  email?: string;
  role: string;
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
