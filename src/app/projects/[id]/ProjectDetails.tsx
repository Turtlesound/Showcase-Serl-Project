// /src/app/projects/[id]/ProjectDetails.tsx

'use client'; // This marks the component as a Client Component

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProjectDetails({ projectData }) {
  const [project, setProject] = useState(projectData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/projects.json', { cache: 'no-store' });
      const data = await res.json();
      const updatedProject = data.projects.find((project) => project.id === projectData.id);
      if (!updatedProject) throw new Error('Project not found');
      setProject(updatedProject);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchProject, 60000); // Fetch every minute
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [projectData.id]);

  if (loading) return <p>Loading project...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <Image
        src={project.screenshots[0]}
        alt={project.title}
        width={600}
        height={300}
        className="mb-4"
      />
      <p>{project.description}</p>
      <p className="italic mt-2">Type: {project.type}</p>
      <p>Tags: {project.tags.join(', ')}</p>
      <p>Author: {project.author}</p>
      <p>Created: {project.created_at}</p>
      <p>Updated: {project.updated_at}</p>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-4 inline-block"
      >
        Visit Project
      </a>
    </div>
  );
}
