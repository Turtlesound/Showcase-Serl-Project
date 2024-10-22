'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProjectById } from '@/lib/projectService';
import { Project } from '@/lib/projectTypes';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';


export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setIsFullscreen] = React.useState(false);
  const router = useRouter();
  const id = params.id; 

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

   // Function to trigger fullscreen, I noticed it is blocked on most browser but if you turn it of on a raspberry it should fullscreen on loading website.
  useEffect(() => {
    const requestFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .then(() => setIsFullscreen(true))
                .catch((err) => console.error('Fullscreen request failed', err));
        }
    };

    requestFullscreen();

    const onFullscreenChange = () => {
        setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
        document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
}, []);

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
            <p className="text-lg text-gray-600">
            {id ? `No projects with id "${id}".` : `No projects found.`}
            </p>
      </div>
    );
  }


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

    {/* General Wrapper div */}
    <div className="container mx-auto max-w-full px-4 py-0">
        <div className="min-h-screen bg-gray-50 py-8">
          {/* Main content section */}
        <div className="flex flex-col justify-between px-4">
            {/* Top section with grey backdrop */}
            
            <div className="bg-white p-8 rounded-lg flex flex-col md:flex-row gap-8 mb-4 flex-1 mr-0 shadow-md">


              {/* Project Info section */}
            <div className="md:w-1/4 flex flex-col gap-4 ">
                {/* QR Code and Visit button section */}
                <div className="flex flex-col gap-2 ">
                <QRCodeSVG value={project.url} size={140} />
                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-500 hover:underline text-lg font-semibold"
                >
                </a>


                
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 break-words">{project.title}</h1>
                {/* Project Description Section */}
                <p className="text-gray-600 mb-4 break-words">{project.description}</p>

                
                {/* Author and date section */}
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <p>
                    Author: <span className="font-semibold">{project.author}</span>
                </p>
                <p>
                    Created: <span className="font-semibold">{new Date(project.created_at).toLocaleDateString()}</span>
                </p>
                <p>
                    Updated: <span className="font-semibold">{new Date(project.updated_at).toLocaleDateString()}</span>
                </p>

                
                
                </div>

            </div>
                    {/* Screenshot section */}
                    <div className="flex-1 flex md:flex-wrap gap-4 ">
                    {project.screenshots.map((screenshot, index) => (
                        <div key={index} className="relative flex-1 flex-wrap h-[500px]">
                        <Image
                            src={screenshot}
                            alt={`${project.title} screenshot ${index + 1}`}
                            fill
                            sizes="100vw"
                            onError={(e) => { e.currentTarget.src = '/noscreenshot.png'; }}
                            className="rounded-lg object-contain cursor-pointer"
                        />
                        </div>
                    ))}
                    </div>

                
            </div>
            {/* Sidebar with Tags and Type on the right */}
            <div className="w-full mt-0">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-sm text-gray-600 font-semibold">
                Type:{" "}
                <span
                    className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold"
                >
                    {project.type}
                </span>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 font-semibold mt-4">
                Tags: 
                {project.tags.map((tag) => (
                    <span
                    key={tag}
                    className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold"
                    >
                    {tag}
                    </span>
                ))}
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </>
);
}
