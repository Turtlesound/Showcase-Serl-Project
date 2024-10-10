'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProjectById } from '@/lib/projectService';
import { Project } from '@/lib/projectTypes';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation'; // Use for tag navigation
import ReactMarkdown from 'react-markdown';  // Import the markdown parser
import rehypeRaw from 'rehype-raw';          // To allow raw HTML
import DOMPurify from 'dompurify';           // sanitize the HTML   

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter(); // For tag and type navigation

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

  // Sanitize the HTML content before rendering
  const sanitizedDescription = DOMPurify.sanitize(project.description_long);

  // Navigate to the projects page with a specific tag or type as a search parameter
  const handleTagClick = (tag: string) => {
    router.push(`/projects?search=${tag}`);
  };

  const handleTypeClick = (type: string) => {
    router.push(`/projects?search=${type}`);
  };

  return (
    <div className="min-h-screen p-8">
      {/* Top section with grey backdrop */}
      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Screenshot section */}
          <div className="relative h-[500px] w-full">
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

          {/* Project Info section */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

            <p className="text-sm text-gray-600 mb-2">
              Type:{" "}
              <span
                onClick={() => handleTypeClick(project.type)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                {project.type}
              </span>
            </p>

            <div className="text-sm text-gray-500 flex flex-wrap gap-2 mb-2">
              Tags:{" "}
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

            <p className="text-sm text-gray-600 mb-2">
              Author: <span className="font-semibold">{project.author}</span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Created:{" "}
              <span className="font-semibold">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Updated:{" "}
              <span className="font-semibold">
                {new Date(project.updated_at).toLocaleDateString()}
              </span>
            </p>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-500 hover:underline text-lg font-semibold"
            >
              Visit Project
            </a>

            {/* QR Code */}
            <div className="mt-6">
              <QRCodeSVG value={project.url} size={100} />
            </div>
          </div>
        </div>
      </div>

      {/* Long description section below the top */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Project Description</h2>
        <div className="prose max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {sanitizedDescription}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
