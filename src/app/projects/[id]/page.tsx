// src/app/projects/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProjectById } from '@/lib/projectService'; // Only import the service
import { Project } from '@/lib/projectTypes'; // Import the Project type

// component to receive `params` from Next.js dynamic routing
export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project details when the component mounts or `id` changes
  useEffect(() => {
    const fetchProject = async () => {
      const id = params.id; // Access the `id` from params

      if (!id) return; // Check if ID is available

      setLoading(true);
      setError(null);

      try {
        const data = await getProjectById(id); // Fetch the project by ID
        if (data) {
          setProject(data); // Set the project if data is defined
        } else {
          setProject(null); // Explicitly set to null if data is undefined
        }
      } catch (err: any) {
        setError('Error fetching project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject(); // Call fetchProject when the component mounts or ID changes
  }, [params.id]); // Depend on params.id to watch for changes

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading project...</p>
      </div>
    );
  }

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-red-600">Error: {error}</p>
      </div>
    );
  }

  // No project found
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Project not found.</p>
      </div>
    );
  }

  // Render project details
  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="mb-6">
          <Image
            src={project.screenshots[0]}
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
