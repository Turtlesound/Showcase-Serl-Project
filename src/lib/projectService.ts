// Define the Project type
export interface Project {
    id: string;
    title: string;
    description: string;
    screenshots: string[];
    tags: string[];
    type: string;
    author: string;
    created_at: string;
    updated_at: string;
    url: string;
  }
  
  // Fetch all projects
  export async function getProjects(): Promise<Project[]> {
    const res = await fetch('http://localhost:3000/projects.json', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data = await res.json();
    return data.projects;
  }
  
  // Fetch a single project by ID
  export async function getProjectById(id: string): Promise<Project | undefined> {
    const projects = await getProjects();
    return projects.find((project) => project.id === id);
  }
  