// /src/app/projects/[id]/params.ts
async function getProjects() {
    const res = await fetch('http://localhost:3000/projects.json', { cache: 'no-store' });
    const data = await res.json();
    return data.projects;
  }
  
  export async function generateStaticParams() {
    const projects = await getProjects();
    return projects.map((project) => ({
      id: project.id,
    }));
  }
  