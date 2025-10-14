export interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
}

export interface ITeam {
  _id: string;
  name: string;
  manager: string;
  director: string;
  description: string;
  status: "0" | "1" | "-1";
  members: TeamMember[];
  managerApproved?: "0" | "1" | "-1";
  directorApproved?: "0" | "1" | "-1";
}

export type FormErrors = Record<string, string>;
