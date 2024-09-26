// src/lib/projectService.ts

import { Project } from './projectTypes'; //  Project structure 

// Fetch all projects
export async function getProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  const data = await res.json();
  return data.projects as Project[]; 
}

// Fetch a project by ID
export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  console.log('All Projects:', projects);
  console.log('Searching for Project ID:', id);

  const project = projects.find((project: Project) => project.id === id);
  if (!project) {
    console.warn(`Project with ID ${id} not found.`);
  }

  return project;
}
