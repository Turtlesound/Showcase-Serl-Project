// lib/projectService.ts

import { Project } from './projectTypes'; // Adjust the import path as necessary

// Fetch all projects
export async function getProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects'); // Fetch from the local API route
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  const data = await res.json();
  return data.projects; // Return the projects array
}

// lib/projectService.ts

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects(); // Get all projects
  console.log('All Projects:', projects); // Log all projects
  console.log('Searching for Project ID:', id); // Log the ID being searched

  const project = projects.find((project: Project) => project.id === id); // Find the project by ID

  if (!project) {
    console.warn(`Project with ID ${id} not found.`);
  }

  return project; // Return the found project or undefined if not found
}


