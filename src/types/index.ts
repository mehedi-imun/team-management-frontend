export interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
}

export interface Team {
  _id: string;
  name: string;
  manager: string;
  director: string;
  description: string;
  status: number; // 0: no action, 1: approved, -1: not approved
  members: TeamMember[];
  order?: number;
}

export interface FormErrors {
  [key: string]: string;
}