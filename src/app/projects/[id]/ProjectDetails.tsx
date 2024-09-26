'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Project, getProjectById } from '@/lib/projectService'; // Import the Project type and fetch function

interface ProjectDetailsProps {
  projectData: Project; // Expecting project data as a prop
}

export default function ProjectDetails({ projectData }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project>(projectData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const updatedProject = await getProjectById(projectData.id); // Use getProjectById to fetch project
        if (!updatedProject) throw new Error('Project not found');
        setProject(updatedProject); // Update the project state
      } catch (err: any) {
        setError(err.message); // Set error state
      } finally {
        setLoading(false); // Stop loading
      }
    };

    const intervalId = setInterval(fetchProject, 60000); // Fetch every minute
    fetchProject(); // Initial fetch
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [projectData.id]);

  // Render loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Render project details
  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="mb-6">
          <Image
            src={project.screenshots[0]} // Render project image
            alt={project.title}
            width={400}  
            height={250} 
            className="rounded-lg object-cover w-full h-auto"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg mb-4">{project.description}</p>
          <p className="italic text-sm text-gray-600 mb-2">Type: {project.type}</p>
          <p className="text-sm text-gray-600 mb-2">Tags: {project.tags.join(', ')}</p>
          <p className="text-sm text-gray-600 mb-2">Author: <span className="font-semibold">{project.author}</span></p>
          <p className="text-sm text-gray-600 mb-2">Created: <span className="font-semibold">{new Date(project.created_at).toLocaleDateString()}</span></p>
          <p className="text-sm text-gray-600 mb-2">Updated: <span className="font-semibold">{new Date(project.updated_at).toLocaleDateString()}</span></p>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-500 hover:underline text-lg font-semibold"
          >
            Visit Project
          </a>
        </div>
      </div>
    </div>
  );
}
