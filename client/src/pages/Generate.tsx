import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import SoftBackdrop from '../components/SoftBackdrop'
import AspectRatio from '../components/AspectRatio'
import { colorSchemes, type IThumbnail, type ThumbnailStyle } from '../assets/assets'
import StyleSelector from '../components/StyleSelector'
import ColorSchemeSelector from '../components/ColorSchemeSelector'
import PreviewPanel from '../components/PreviewPanel'
import { useAuth } from '../context/AuthContext'
import toast from "react-hot-toast"
import api from '../configs/api'

const Generate = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [title, setTitle] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null)
  const [loading, setLoading] = useState(false)

  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [colorSchemeId, setColorSchemeId] = useState(colorSchemes[0].id)
  const [style, setStyle] = useState<ThumbnailStyle>('Bold & Graphic')
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false)

  // ✅ GENERATE
  const handleGenerate = async () => {
    try {
      if (!isLoggedIn) return toast.error("Login first")
      if (!title.trim()) return toast.error("Title required")

      setLoading(true)

      const payload = {
        title,
        prompt: additionalDetails,
        style,
        aspect_ratio: aspectRatio,
        color_scheme: colorSchemeId,
        text_overlay: true
      }

      const { data } = await api.post('/api/thumbnail/generate', payload)

      if (data.thumbnail) {
        // ✅ set immediately for preview
        setThumbnail(data.thumbnail)

        // ✅ navigate
        navigate('/generate/' + data.thumbnail._id)

        toast.success(data.message)
      }

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed")
    } finally {
      setLoading(false)
    }
  }

  // ✅ FETCH THUMBNAIL
  const fetchThumbnail = async () => {
    try {
      const { data } = await api.get(`/api/user/thumbnail/${id}`)

      if (data?.thumbnail) {
        setThumbnail(data.thumbnail)

        setLoading(!data.thumbnail.image_url)

        setTitle(data.thumbnail.title || "")
        setAdditionalDetails(data.thumbnail.user_prompt || "")
        setColorSchemeId(data.thumbnail.color_scheme)
        setAspectRatio(data.thumbnail.aspect_ratio)
        setStyle(data.thumbnail.style)
      }

    } catch (error: any) {
      toast.error("Error fetching thumbnail")
    }
  }

  // ✅ FIXED useEffect
  useEffect(() => {
    if (id && isLoggedIn) {
      fetchThumbnail()
    }
  }, [id, isLoggedIn])

  // ✅ POLLING (only when generating)
  useEffect(() => {
    if (!id || !loading) return

    const interval = setInterval(() => {
      fetchThumbnail()
    }, 4000)

    return () => clearInterval(interval)

  }, [id, loading])

  return (
    <>
      <SoftBackdrop />

      <div className='pt-24 min-h-screen'>
        <main className='max-w-6xl mx-auto px-4 py-8'>

          <div className='grid lg:grid-cols-[400px_1fr] gap-8'>

            {/* LEFT */}
            <div className={`space-y-6 ${id && 'pointer-events-none'}`}>
              <div className='p-6 rounded-2xl bg-white/10 border space-y-6'>

                <h2>Create Thumbnail</h2>

                {/* TITLE */}
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className='w-full p-3 rounded bg-black/30'
                />

                {/* CONTROLS */}
                <AspectRatio value={aspectRatio} onChange={setAspectRatio} />
                <StyleSelector value={style} onChange={setStyle} isOpen={styleDropdownOpen} setIsOpen={setStyleDropdownOpen} />
                <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId} />

                {/* PROMPT */}
                <label className='block text-sm font-medium '>Additional Prompts <span className='text-zinc-400 text-xs'>(Optional)</span></label>
                <textarea
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Extra details"
                  className='w-full p-3 rounded bg-black/30'
                />

                {/* BUTTON */}
                {!id && (
                  <button onClick={handleGenerate} className='text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors'> {loading ? 'Generating...' : 'Generate Thumbnail'} </button>
                )}

              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div className='p-6 rounded-2xl bg-white/10'>
                <h2>Preview</h2>

                <PreviewPanel
                  thumbnail={thumbnail}
                  isLoading={loading}
                  aspectRatio={aspectRatio}
                />
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}

export default Generate