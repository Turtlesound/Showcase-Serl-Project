// /src/app/projects/[id]/page.tsx
import ProjectDetails from './ProjectDetails';

async function getProjects() {
  const res = await fetch('http://localhost:3000/projects.json');
  const data = await res.json();
  return data.projects;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

async function getProjectById(id) {
  const projects = await getProjects();
  return projects.find((project) => project.id === id);
}

export default async function Page({ params }) {
  const project = await getProjectById(params.id);

  if (!project) {
    return <p>Project not found.</p>;
  }

  return <ProjectDetails projectData={project} />;
}
