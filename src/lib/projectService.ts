import { Project } from './projectTypes'

// Fetch all projects from API
export async function getProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects')
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }
  const data = await res.json()
  return data.projects as Project[]
}

// Fetch projects sorted by creation
export const getProjectsCreated = async () => {
  const projects = await getProjects();
  return projects.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    // Handle cases where created_at might be missing or invalid
    if (isNaN(dateA.getTime())) return 1; 
    if (isNaN(dateB.getTime())) return -1; 

    return dateB.getTime() - dateA.getTime(); // Sort by created_at descending
  });
};

// Fetch projects sorted by updated
export const getProjectsUpdated = async () => {
  const projects = await getProjects();
  // Sort by updated date
  return projects.sort((a, b) => {
    const dateA = new Date(a.updated_at);
    const dateB = new Date(b.updated_at);

    // Handle cases where updated_at might be missing or invalid
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1; 

    return dateB.getTime() - dateA.getTime(); // Sort by updated_at descending
  });
};

// Fetch a specific project by ID
export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects()
  const project = projects.find((project: Project) => project.id === id)
  return project
}

// Function to search projects based on a search term
// Function to search projects based on a search term
export const searchProjects = async (
  searchTerm: string
): Promise<Project[]> => {
  const projects = await getProjects();
  
  const filteredProjects = projects.filter((project) => {
    return (
      (project.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(project.tags) && project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (project.type?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.author?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return filteredProjects;
};

