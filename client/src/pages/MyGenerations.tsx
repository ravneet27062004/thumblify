import React, { useEffect, useState } from 'react'
import  SoftBackdrop from '../components/SoftBackdrop'
import { dummyThumbnails, type IThumbnail } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../configs/api'
import toast from 'react-hot-toast'

const MyGenerations = () => {
const {isLoggedIn}=useAuth();
  const navigate=useNavigate()

  const aspectRatioClassMap:Record<string,string>=
{
  '16:9':'aspect-video',
        '1:1':'aspect-square',
        '9:16':'aspect-[9/16]'
}



  const [thumbnails,setthumbnails]=useState<IThumbnail[]>([])

  const [loading,setloading]=useState(false)
   const fetchThumbnails=async()=>{
   try{
    setloading(true);
    const {data}=await api.get('/api/user/thumbnails')
    setthumbnails(data.thumbnails ||[])

   }catch(error:any){
    console.log(error)
    toast.error(error?.response?.data?.message ||error.message
    )

   }finally{
    setloading(false)
   }

   }
   const handleDownload=(image_url:string)=>{
    const link=document.createElement('a');
       link.href=image_url.replace('/upload','/upload/fl_attachment')
       document.body.appendChild(link)
       link.click()
       link.remove()
   }
   const handleDelete=async(id:string)=>{
   try{
    const confirm =window.confirm('are you sure you want to delete this thumbnail?')
    if(!confirm)return ;
const {data}=await api.delete(`api/thumbnail/delete/${id}`)
toast.success(data.message)
setthumbnails(thumbnails.filter((t)=>t._id!==id))
   }catch(error:any){
    console.log(error)
    toast.error(error?.response?.data?.message ||error.message
    )

   }
   }

   useEffect(()=>{
    if(isLoggedIn){
        fetchThumbnails()
    }
  
   },[isLoggedIn])
 
  return (
   <>
   <SoftBackdrop/>
   <div className=' mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
    {/* header */}
    <div className='mb-8'>
      <h1 className='text-2xl font-bold text-zinc-200'>My Generations</h1>
      <p className='text-sm text-zinc-400 mt-1 '>View and manage your AI-generated thumbnails</p>
    </div>
{/* loading */}
{loading && (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
{Array.from({length:6}).map((_,i)=>(
  <div key={i} className='rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]'/>
))}
    </div>
)}
{/* empty state */}
{!loading && thumbnails.length===0 && (
  <div className='py-24 text-center '>
    <h3 className='text-lg font-semibold text-zinc-200'>No thumbnails yet</h3>
<p className='text-zinc-400 text-sm mt-2'>Generate some thumbnails to see them here!</p>
  </div>
)}

{/* thumbnails grid */}
{!loading && thumbnails.length>0 && (
  <div className='columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8'>
{thumbnails.map((thumb:IThumbnail)=>{
  const aspectClass = aspectRatioClassMap[thumb.aspect_ratio || '16:9'];

  return (
    <div key={thumb._id} onClick={()=>navigate(`/generate/${thumb._id}`)} className='mb-8 rounded-2xl bg-white/6 border border-white/10 shadow-xl cursor-pointer relative break-inside-avoid group'>
      
      {/* image */}
      <div className={`rounded-t-2xl overflow-hidden ${aspectClass} bg-black`}>
        {thumb.image_url ? (
          <img src={thumb.image_url} alt={thumb.title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-sm text-zinc-400'>
            {thumb.isGenerating ? 'Generating...' : 'Failed to generate'}
          </div>
        )}

        {thumb.isGenerating && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white'>
            Generating...
          </div>
        )}
      </div>

      {/* content */}
      <div className='p-4 space-y-2'>
        <h3 className='text-sm font-semibold text-zinc-100 line-clamp-2'>
          {thumb.title}
        </h3>
        <div className='flex flex-wrap gap-2 text-xs text-zinc-400'>
        <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.style}</span>
          <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.color_scheme}</span>
            <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.aspect_ratio}</span>
        </div>
        <p className='text-xs text-zinc-500'>{new Date(thumb.createdAt!).toDateString()}</p>
      </div>
<div onClick={(e)=>e.stopPropagation()} className='absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5'>

  <TrashIcon className='size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all' onClick={()=>handleDelete(thumb._id)}/>

  <DownloadIcon className='size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all ' onClick={()=>handleDownload(thumb.image_url!)}/>
<Link to={`/preview?thumbnail_url=${thumb.image_url}&title=${thumb.title}`} target='_blank'>
  <ArrowUpRightIcon className='size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all'/>
</Link>
  
</div>
    </div>
  )
})}

  </div>
)}
</div>   
</>
  )
} 

  

export default MyGenerations;
