'use client';

import React, { useState, useEffect} from 'react';
import Image from 'next/image';
import { getProjectById } from '@/lib/projectService';
import { Project } from '@/lib/projectTypes';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';
import Head from 'next/head';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
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

  // Handle tag and type navigation
  const handleTagClick = (tag: string) => {
    router.push(`/projects?search=${tag}`);
  };

  const handleTypeClick = (type: string) => {
    router.push(`/projects?search=${type}`);
  };

  return (
    <>
      <Head>
        <title>{project.title}</title>
        <meta name="description" content={project.description} />
      </Head>
      <div className="min-h-screen p-8 flex flex-col md:flex-row">
        {/* Main content section */}
        <div className="flex-grow flex flex-col space-y-8 md:mr-8"> {/* Adjust spacing */}
          {/* Top section with grey backdrop */}
          <div className="bg-white p-8 rounded-lg flex flex-col md:flex-row gap-8 mb-8">
            {/* Screenshot section */}
            <div className="w-full md:w-1/2 relative h-[500px]">
              <Image
                src={project.screenshots[currentImageIndex]}
                alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                fill
                sizes="100vw"
                className="rounded-lg object-contain"
                priority={currentImageIndex === 0}
              />
              <div className="absolute inset-0 flex justify-between items-center">
                <button
                  className="bg-gray-200 text-gray-800 text-3xl cursor-pointer p-1 rounded-full transition duration-200 hover:bg-gray-300"
                  onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + project.screenshots.length) % project.screenshots.length)}
                  aria-label="Previous image"
                >
                  &#10094;
                </button>
                <button
                  className="bg-gray-200 text-gray-800 text-3xl cursor-pointer p-1 rounded-full transition duration-200 hover:bg-gray-300"
                  onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.screenshots.length)}
                  aria-label="Next image"
                >
                  &#10095;
                </button>
              </div>
            </div>

            {/* Project Info section */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
              {/* Project Description Section */}
              <p className="text-gray-700 mb-4">{project.description}</p>

              {/* QR Code and Visit button section */}
              <div className="flex flex-col gap-2">
                <QRCodeSVG value={project.url} size={140} />
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-blue-500 hover:underline text-lg font-semibold"
                >
                  Visit project
                </a>
              </div>

              {/* Author and date section */}
              <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                <p>Author: <span className="font-semibold">{project.author}</span></p>
                <p>Created: <span className="font-semibold">{new Date(project.created_at).toLocaleDateString()}</span></p>
                <p>Updated: <span className="font-semibold">{new Date(project.updated_at).toLocaleDateString()}</span></p>
              </div>
            </div>
          </div>

          {/* Long description section below the top */}
          <div className="prose max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {sanitizedDescription}
            </ReactMarkdown>
          </div>
        </div>

        {/* Sidebar with Tags and Type on the right */}
        <div className="md:w-1/3 lg:w-1/4 bg-gray-50 p-4 rounded-lg shadow h-full"> {/* Added lg:w-1/4 for responsiveness */}
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600 font-semibold">
              Type:{" "}
              <span
                onClick={() => handleTypeClick(project.type)}
                className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold cursor-pointer"
              >
                {project.type}
              </span>
            </div>
            <div className="text-sm text-gray-600 font-semibold">
              Tags:{" "}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
