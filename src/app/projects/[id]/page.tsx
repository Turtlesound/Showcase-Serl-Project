'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProjectById } from '@/lib/projectService';
import { Project } from '@/lib/projectTypes';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation'; // Use for tag navigation

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter(); // For tag navigation

  useEffect(() => {
    const fetchProject = async () => {
      const id = params.id;

      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getProjectById(id);
        if (data) {
          setProject(data);
        } else {
          setProject(null);
        }
      } catch (err: any) {
        setError('Error fetching project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Project not found.</p>
      </div>
    );
  }

  // Navigate to the projects page with a specific tag as a search parameter
  const handleTagClick = (tag: string) => {
    router.push(`/projects?search=${tag}`);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="mb-6 relative h-[500px] w-full">
          <Image
            src={project.screenshots[currentImageIndex]}
            alt={`${project.title} screenshot ${currentImageIndex + 1}`}
            fill
            sizes="100vw"
            className="rounded-lg object-contain"
          />
          <div className="absolute inset-0 flex justify-between items-center">
            <button 
              className="bg-transparent text-gray-800 text-3xl cursor-pointer p-1 hover:bg-gray-200 rounded-full"
              onClick={() => setCurrentImageIndex((prevIndex) => 
                (prevIndex - 1 + project.screenshots.length) % project.screenshots.length
              )}
              aria-label="Previous image"
            >
              &#10094;
            </button>
            <button 
              className="bg-transparent text-gray-800 text-3xl cursor-pointer p-1 hover:bg-gray-200 rounded-full"
              onClick={() => setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % project.screenshots.length
              )}
              aria-label="Next image"
            >
              &#10095;
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg mb-4">{project.description}</p>
          <p className="italic text-sm text-gray-600 mb-2">Type: {project.type}</p>

          {/* Clickable Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="text-blue-500 hover:underline cursor-pointer text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

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

          {/* QR Code */}
          <div className="mb-4">
            <QRCodeSVG value={project.url} size={100} />
          </div>
        </div>
      </div>
    </div>
  );
}
