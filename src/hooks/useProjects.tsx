import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  vertical: string;
  progress: number;
  start_date?: string;
  due_date?: string;
  completed_date?: string;
  project_lead_id?: string;
  budget?: number;
  estimated_hours?: number;
  actual_hours?: number;
  family_id?: string;
  client_id: string;
  tenant_id: string;
  created_by: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  due_date: string;
  completed: boolean;
  completed_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deliverables?: string[];
  dependencies?: string[];
  assigned_team?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  milestone_id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'blocked' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCommunication {
  id: string;
  project_id: string;
  type: 'message' | 'meeting' | 'email' | 'note' | 'update' | 'announcement';
  subject?: string;
  content: string;
  participants?: string[];
  mentions?: string[];
  parent_id?: string;
  thread_count?: number;
  attachments?: string[];
  tags?: string[];
  is_pinned?: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  is_confidential?: boolean;
  access_level: 'public' | 'team' | 'leads_only' | 'confidential';
  folder_path?: string;
  tags?: string[];
  version?: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectTeamAssignment {
  id: string;
  project_id: string;
  professional_id: string;
  role: 'lead' | 'member' | 'consultant' | 'observer';
  permissions?: string[];
  assigned_by: string;
  assigned_at: string;
  notes?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectActivity {
  id: string;
  project_id: string;
  activity_type: string;
  description: string;
  entity_type?: string;
  entity_id?: string;
  old_values?: any;
  new_values?: any;
  created_by: string;
  created_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch user's projects
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects((data || []).map(p => ({
        ...p,
        status: p.status as Project['status'],
        priority: p.priority as Project['priority']
      })));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error fetching projects",
        description: "Failed to load your projects",
        variant: "destructive"
      });
    }
  };

  // Fetch milestones
  const fetchMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setMilestones((data || []).map(m => ({
        ...m,
        priority: m.priority as ProjectMilestone['priority']
      })));
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks((data || []).map(t => ({
        ...t,
        status: t.status as ProjectTask['status'],
        priority: t.priority as ProjectTask['priority']
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Create a new project
  const createProject = async (projectData: Partial<Project>) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          description: projectData.description,
          status: projectData.status || 'planning',
          priority: projectData.priority || 'medium',
          vertical: projectData.vertical || 'other',
          progress: projectData.progress || 0,
          due_date: projectData.due_date,
          budget: projectData.budget || 0,
          client_id: user.id,
          created_by: user.id
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project created",
        description: "Your new project has been created successfully"
      });

      await fetchProjects();
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error creating project",
        description: "Failed to create project",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Update project
  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project updated",
        description: "Project has been updated successfully"
      });

      await fetchProjects();
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error updating project",
        description: "Failed to update project",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete project
  const deleteProject = async (projectId: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "Project has been deleted successfully"
      });

      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error deleting project",
        description: "Failed to delete project",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Real-time subscription setup
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchMilestones(), fetchTasks()]);
      setLoading(false);
    };

    fetchAll();

    // Set up real-time subscriptions
    const projectsChannel = supabase
      .channel('projects-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'projects' }, 
          (payload) => {
            console.log('Project change received:', payload);
            fetchProjects();
          }
      )
      .subscribe();

    const milestonesChannel = supabase
      .channel('milestones-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'project_milestones' }, 
          (payload) => {
            console.log('Milestone change received:', payload);
            fetchMilestones();
          }
      )
      .subscribe();

    const tasksChannel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'project_tasks' }, 
          (payload) => {
            console.log('Task change received:', payload);
            fetchTasks();
          }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(milestonesChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, []);

  return {
    projects,
    milestones,
    tasks,
    loading,
    saving,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects
  };
};

export const useProjectMilestones = (projectId?: string) => {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchMilestones = async () => {
    if (!projectId) {
      setMilestones([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setMilestones((data || []).map(m => ({
        ...m,
        priority: m.priority as ProjectMilestone['priority']
      })));
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast({
        title: "Error fetching milestones",
        description: "Failed to load project milestones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createMilestone = async (milestoneData: Partial<ProjectMilestone>) => {
    if (!projectId) return null;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .insert({
          project_id: projectId,
          title: milestoneData.title || '',
          description: milestoneData.description,
          due_date: milestoneData.due_date || new Date().toISOString().split('T')[0],
          priority: milestoneData.priority || 'medium'
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Milestone created",
        description: "New milestone has been added to the project"
      });

      await fetchMilestones();
      return data;
    } catch (error) {
      console.error('Error creating milestone:', error);
      toast({
        title: "Error creating milestone",
        description: "Failed to create milestone",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateMilestone = async (milestoneId: string, updates: Partial<ProjectMilestone>) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .update(updates)
        .eq('id', milestoneId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Milestone updated",
        description: "Milestone has been updated successfully"
      });

      await fetchMilestones();
      return data;
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: "Error updating milestone",
        description: "Failed to update milestone",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMilestones();

      // Set up real-time subscription for milestones
      const channel = supabase
        .channel(`milestones-${projectId}`)
        .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'project_milestones',
              filter: `project_id=eq.${projectId}`
            }, 
            (payload) => {
              console.log('Milestone change received:', payload);
              fetchMilestones();
            }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [projectId]);

  return {
    milestones,
    loading,
    saving,
    createMilestone,
    updateMilestone,
    refreshMilestones: fetchMilestones
  };
};

export const useProjectTasks = (projectId?: string) => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!projectId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks((data || []).map(t => ({
        ...t,
        status: t.status as ProjectTask['status'],
        priority: t.priority as ProjectTask['priority']
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error fetching tasks",
        description: "Failed to load project tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<ProjectTask>) => {
    if (!projectId) return null;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: projectId,
          title: taskData.title || '',
          description: taskData.description,
          status: taskData.status || 'todo',
          priority: taskData.priority || 'medium',
          due_date: taskData.due_date,
          milestone_id: taskData.milestone_id,
          created_by: user.id
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Task created",
        description: "New task has been added to the project"
      });

      await fetchTasks();
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error creating task",
        description: "Failed to create task",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<ProjectTask>) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Task updated",
        description: "Task has been updated successfully"
      });

      await fetchTasks();
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error updating task",
        description: "Failed to update task",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();

      // Set up real-time subscription for tasks
      const channel = supabase
        .channel(`tasks-${projectId}`)
        .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'project_tasks',
              filter: `project_id=eq.${projectId}`
            }, 
            (payload) => {
              console.log('Task change received:', payload);
              fetchTasks();
            }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [projectId]);

  return {
    tasks,
    loading,
    saving,
    createTask,
    updateTask,
    refreshTasks: fetchTasks
  };
};

export const useProjectCommunications = (projectId?: string) => {
  const [communications, setCommunications] = useState<ProjectCommunication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchCommunications = async () => {
    if (!projectId) {
      setCommunications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('project_communications')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunications((data || []).map(c => ({
        ...c,
        type: c.type as ProjectCommunication['type']
      })));
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast({
        title: "Error fetching communications",
        description: "Failed to load project communications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCommunication = async (communicationData: Partial<ProjectCommunication>) => {
    if (!projectId) return null;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('project_communications')
        .insert({
          project_id: projectId,
          type: communicationData.type || 'message',
          content: communicationData.content || '',
          subject: communicationData.subject,
          participants: communicationData.participants || [],
          created_by: user.id
        } as any)
        .select()
        .single();

      if (error) throw error;

      await fetchCommunications();
      return data;
    } catch (error) {
      console.error('Error creating communication:', error);
      toast({
        title: "Error sending message",
        description: "Failed to send communication",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchCommunications();

      // Set up real-time subscription for communications
      const channel = supabase
        .channel(`communications-${projectId}`)
        .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'project_communications',
              filter: `project_id=eq.${projectId}`
            }, 
            (payload) => {
              console.log('Communication change received:', payload);
              fetchCommunications();
            }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [projectId]);

  return {
    communications,
    loading,
    saving,
    createCommunication,
    refreshCommunications: fetchCommunications
  };
};