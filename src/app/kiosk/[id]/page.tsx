'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getProjectById } from '@/lib/projectService'
import { Project } from '@/lib/projectTypes'
import { QRCodeSVG } from 'qrcode.react'
import Head from 'next/head'

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [, setIsFullscreen] = React.useState(false)
  const id = params.id

  useEffect(() => {
    const fetchProject = async () => {
      const id = params.id

      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const data = await getProjectById(id)
        if (data) {
          setProject(data)
        } else {
          setProject(null)
        }
      } catch (err: any) {
        setError('Error fetching project details')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  // Function to trigger fullscreen, I noticed it is blocked on most browser but if you turn off autoblock in the browser on an raspberry it should fullscreen on loading website.
  useEffect(() => {
    const requestFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement
          .requestFullscreen() // you can add this without request to force fullscreen (not considered "correct")
          .then(() => setIsFullscreen(true))
          .catch((err) => console.error('Fullscreen request failed', err))
      }
    }

    requestFullscreen()

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-lg font-medium text-red-600'>Error: {error}</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-lg text-gray-600'>
          {id ? `No projects with id "${id}".` : `No projects found.`}
        </p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{project.title}</title>
        <meta name='description' content={project.description} />
      </Head>

      {/* General Wrapper div */}
      <div className='container mx-auto max-w-full px-4 py-0'>
        <div className='min-h-screen bg-gray-50 py-8'>
          {/* Main content section */}
          <div className='flex flex-col justify-between px-4'>
            {/* Top section with grey backdrop */}

            <div className='mb-4 mr-0 flex flex-1 flex-col gap-8 rounded-lg bg-white p-8 shadow-md md:flex-row'>
              {/* Project Info section */}
              <div className='flex flex-col gap-4 md:w-1/4 '>
                {/* QR Code and Visit button section */}
                <div className='flex flex-col gap-2 '>
                  <QRCodeSVG value={`${window.location.origin}/projects/${id}`} size={140} />
                  <a
                    href={`${window.location.origin}/projects/${id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-4 inline-block text-lg font-semibold text-blue-500 hover:underline'
                  ></a>
                </div>
                <h1 className='mb-4 break-words text-3xl font-bold md:text-4xl'>
                  {project.title}
                </h1>
                {/* Project Description Section */}
                <p className='mb-4 break-words text-gray-600'>
                  {project.description}
                </p>

                {/* Author and date section */}
                <div className='flex-wrap gap-2 text-sm text-gray-600'>
                  <p>
                    Author:{' '}
                    <span className='font-semibold'>{project.author}</span>
                  </p>
                  <p>
                    Created:{' '}
                    <span className='font-semibold'>
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </p>
                  <p>
                    Updated:{' '}
                    <span className='font-semibold'>
                      {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
              {/* Screenshot section */}
              <div className='flex flex-1 flex-wrap gap-4'>
  {project.screenshots && project.screenshots.length > 0 ? (
    currentProject.screenshots.map((screenshot, index) => (
      <div
        key={index}
        className='relative h-[500px] w-full flex-1 flex-wrap max-sm:h-[500px]'
      >
        <Image
          src={screenshot || '/noscreenshot.png'}  
          alt={`${currentProject.title} screenshot ${index + 1}`}
          fill
          onError={(e) => {
            e.currentTarget.src = '/noscreenshot.png';
          }}
          className='cursor-pointer rounded-lg object-contain'
        />
      </div>
    ))
  ) : (
    <div className="w-full text-center text-gray-500">
      <Image
        src="/noscreenshot.png"
        alt="No screenshots available"
        width={500}
        height={250}
        className="rounded-lg object-contain"
      />
    </div>
  )}
</div>
            </div>
            {/* Sidebar with Tags and Type on the right */}
            <div className='mt-0 w-full'>
  <div className='rounded-lg bg-white p-6 shadow-md'>
    <div className='text-sm font-semibold text-gray-600'>
      Type:{' '}
      <span className='rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-600'>
        {project.type}
      </span>
    </div>
    <div className='mt-4 flex flex-wrap gap-2 text-sm font-semibold text-gray-600'>
      Tags:
      {project.tags && project.tags.length > 0 ? (
        project.tags.map((tag) => (
          <span
            key={tag}
            className='rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-600'
          >
            {tag}
          </span>
        ))
      ) : null}
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
    </>
  )
}
