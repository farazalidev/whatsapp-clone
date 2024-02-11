import React, { ForwardRefRenderFunction, Suspense, forwardRef } from 'react'
import CarouselItem from './CarouselItem'
import { useSelector } from 'react-redux'
import { RootState } from '@/global/store'

interface IGalleryFooterCarouselProps {
}

const GalleryFooterCarousel: ForwardRefRenderFunction<HTMLDivElement, IGalleryFooterCarouselProps> = (props, ref) => {

  const { MediaMessages, activeMediaMessage } = useSelector((state: RootState) => state.GallerySlice)

  const { Me } = useSelector((state: RootState) => state.UserSlice)
  const { receiver_id } = useSelector((state: RootState) => state.ChatSlice)

  return (
    <Suspense fallback={<>Loading...</>}>
      <div ref={ref} className='flex overflow-y-scroll scrollbar w-full justify-center py-[8px] gap-2 place-items-center h-full px-2'>
        {MediaMessages.map((message) => {
          const user_id = message.from.user_id === Me?.user_id ? Me.user_id : receiver_id
          return <div key={message.media?.id}><CarouselItem data={message} url={message.url as string} active={activeMediaMessage?.media?.id === message?.media?.id} user_id={user_id} /></div>
        })}
      </div>
    </Suspense>
  )
}

export default forwardRef(GalleryFooterCarousel)
