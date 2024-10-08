import { Project } from './projectTypes';

// Fetch all projects from API
export async function getProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  const data = await res.json();
  return data.projects as Project[];
}

// Fetch projects sorted by creation  
export const getProjectsCreated = async () => {
  const projects = await getProjects(); 
  return projects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// Fetch projects sorted by updated  
export const getProjectsUpdated = async () => {
  const projects = await getProjects();
  // Sort by updated date
  return projects.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
};

// Fetch a specific project by ID
export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  const project = projects.find((project: Project) => project.id === id);
  return project;
}
