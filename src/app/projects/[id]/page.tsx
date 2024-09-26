// src/app/projects/[id]/page.tsx

import { getProjectById, getProjects, Project } from '@/lib/projectService'; // Import services
import ProjectDetails from './ProjectDetails'; // Import ProjectDetails component

// Fetch and generate static params for dynamic routing
export async function generateStaticParams() {
  const projects: Project[] = await getProjects(); // Fetch all projects
  return projects.map((project) => ({
    id: project.id, // Map each project to a path parameter
  }));
}

// Dynamic project details page component
export default async function Page({ params }: { params: { id: string } }) {
  const project: Project | undefined = await getProjectById(params.id);

  if (!project) {
    return <p>Project not found.</p>;
  }

  return <ProjectDetails projectData={project} />;
}
