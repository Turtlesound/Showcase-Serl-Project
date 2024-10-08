// Import the Project interface from projectTypes
import { Project } from '@/lib/projectTypes';

// Fetch the projects from the JSON file
async function getProjects(): Promise<Project[]> {
  const res = await fetch('http://localhost:3000/projects.json', { cache: 'no-store' });
  const data = await res.json();
  return data.projects;
}

// Generate static params using typed Project
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project: Project) => ({
    id: project.id,
  }));
}
