import React, { ForwardRefRenderFunction, forwardRef } from 'react'
import CarouselItem from './CarouselItem'
import { useSelector } from 'react-redux'
import { RootState } from '@/global/store'

interface IGalleryFooterCarouselProps {
}

const GalleryFooterCarousel: ForwardRefRenderFunction<HTMLDivElement, IGalleryFooterCarouselProps> = (props, ref) => {

  const { thumbnails, active_id } = useSelector((state: RootState) => state.GallerySlice)


  return (
    <div ref={ref} className='flex flex-nowrap overflow-y-scroll scroll-smooth h-full scrollbar w-full justify-center py-[8px] gap-2 place-items-center'>
      {thumbnails.map((data) => {
        return <CarouselItem key={data.media?.id} data={data.media} url={data.url} active={active_id === data.media?.id} />
      })}
    </div>
  )
}

export default forwardRef(GalleryFooterCarousel)
