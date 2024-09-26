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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  const data = await res.json();
  return data.projects; // Return the projects array
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, { cache: 'no-store' }); // Fetch the entire projects.json file
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  const data = await res.json();

  // Find the project by ID
  const project = data.projects.find((project: Project) => project.id === id);

  if (!project) {
    console.warn(`Project with ID ${id} not found. Available IDs:`, data.projects.map((p: Project) => p.id)); // Specify p's type here
  }

  return project; // Return the found project or undefined if not found
}
