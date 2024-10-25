'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getProjectById } from '@/lib/projectService'
import { Project } from '@/lib/projectTypes'
import { QRCodeSVG } from 'qrcode.react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Modal from 'react-modal'
import rehypeRaw from 'rehype-raw'
import DOMPurify from 'dompurify'
import Head from 'next/head'

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const router = useRouter()

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

  // Open the modal when an image is clicked
  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc)
    setIsModalOpen(true)
  }

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

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
        <p className='text-lg text-gray-600'>Project not found.</p>
      </div>
    )
  }

  // Sanitize the HTML content before rendering
  const sanitizedDescription = DOMPurify.sanitize(project.description_long)

  // Handle tag and type navigation
  const handleTagClick = (tag: string) => {
    router.push(`/projects?search=${tag}`)
  }

  const handleTypeClick = (type: string) => {
    router.push(`/projects?search=${type}`)
  }

  return (
    <>
      <Head>
        <title>{project.title}</title>
        <meta name='description' content={project.description} />
      </Head>

      {/* General Wrapper div */}
      <div className='container mx-auto max-w-full px-4 py-8'>
        <div className='min-h-screen bg-gray-50 py-8'>
          {/* Main content section */}
          <div className='flex flex-col justify-between px-4 md:flex-row '>
            {/* Top section with grey backdrop */}

            <div className='mb-8 mr-0 flex flex-1 flex-col gap-8 rounded-lg bg-white p-8 shadow-md md:mr-8 md:flex-row'>
              {/* Screenshot section */}
              <div className='relative h-[500px] w-full' id='modal'>
                <Image
                  src={project.screenshots[currentImageIndex]}
                  alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                  fill
                  sizes='100vw'
                  className='clickable cursor-pointer rounded-lg object-contain'
                  priority={currentImageIndex === 0}
                  onError={(e) => {
                    e.currentTarget.src = '/noscreenshot.png'
                  }}
                  onClick={() =>
                    openModal(project.screenshots[currentImageIndex])
                  }
                />
                {/* Move the button container outside or below the image */}
                <div className='pointer-events-none absolute inset-0 flex items-center justify-between'>
                  <button
                    className='pointer-events-auto cursor-pointer rounded-full bg-gray-200 p-1 text-3xl text-gray-800 transition duration-200 hover:bg-gray-300'
                    onClick={() =>
                      setCurrentImageIndex(
                        (prevIndex) =>
                          (prevIndex - 1 + project.screenshots.length) %
                          project.screenshots.length
                      )
                    }
                    aria-label='Previous image'
                  >
                    &#10094;
                  </button>
                  <button
                    className='pointer-events-auto cursor-pointer rounded-full bg-gray-200 p-1 text-3xl text-gray-800 transition duration-200 hover:bg-gray-300'
                    onClick={() =>
                      setCurrentImageIndex(
                        (prevIndex) =>
                          (prevIndex + 1) % project.screenshots.length
                      )
                    }
                    aria-label='Next image'
                  >
                    &#10095;
                  </button>
                </div>
              </div>

              {/* Project Info section */}
              <div className='flex w-full flex-col gap-4'>
                <h1 className='mb-4 text-3xl font-bold md:text-4xl'>
                  {project.title}
                </h1>
                {/* Project Description Section */}
                <p className='mb-4 text-gray-600   '>{project.description}</p>

                {/* QR Code and Visit button section */}
                <div className='flex flex-col gap-2'>
                  <QRCodeSVG value={project.url} size={140} />
                  <a
                    href={project.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-4 inline-block text-lg font-semibold text-blue-500 hover:underline'
                  >
                    Visit project
                  </a>
                </div>

                {/* Author and date section */}
                <div className='flex flex-wrap gap-2 text-sm text-gray-600'>
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
            </div>

            {/* Sidebar with Tags and Type on the right */}
            <div className='mt-8 w-full md:mt-0 md:w-36'>
              <div className='rounded-lg bg-white p-6 shadow-md'>
                <div className='text-sm font-semibold text-gray-600'>
                  Type:{' '}
                  <span
                    onClick={() => handleTypeClick(project.type)}
                    className='cursor-pointer rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-600'
                  >
                    {project.type}
                  </span>
                </div>
                <div className='mt-4 text-sm font-semibold text-gray-600'>
                  Tags:
                </div>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className='cursor-pointer rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-600'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Long description section */}
          <div className='prose max-w-none px-6'>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {sanitizedDescription}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Modal to display the enlarged image */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel='Enlarged Image'
        className='fixed inset-0 z-50 flex items-center justify-center outline-none focus:outline-none'
        overlayClassName='fixed inset-0 bg-black bg-opacity-75 z-40'
      >
        <div className='relative'>
          {selectedImage && (
            <Image
              src={selectedImage}
              alt='Enlarged Screenshot'
              width={800}
              height={600}
              onError={(e) => {
                e.currentTarget.src = '/noscreenshot.png'
              }}
              className='rounded-lg object-contain'
            />
          )}
          <button
            onClick={closeModal}
            className='absolute right-2 top-2 rounded-full bg-gray-100 p-2 focus:outline-none'
          >
            ✖
          </button>
        </div>
      </Modal>
    </>
  )
}
