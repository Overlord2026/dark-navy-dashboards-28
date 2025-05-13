
export interface Project {
  id: string;
  name: string;
  description?: string;
  project_type: string;
  status: string | "connected" | "pending" | "disconnected" | "error";
  api_token?: string;
  last_sync?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}
