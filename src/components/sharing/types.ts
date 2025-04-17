
export type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: string;
  accessLevel: "full" | "limited";
  dateAdded: Date;
};

export type CollaboratorFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  collaboratorType: string;
  accessLevel: "full" | "limited";
};
