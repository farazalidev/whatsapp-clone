import React, { ForwardRefRenderFunction, Suspense, forwardRef, useCallback } from 'react'
import CarouselItem from './CarouselItem'
import { useSelector } from 'react-redux'
import { RootState } from '@/global/store'

interface IGalleryFooterCarouselProps {
}

const GalleryFooterCarousel: ForwardRefRenderFunction<HTMLDivElement, IGalleryFooterCarouselProps> = (_props, ref) => {

  const { id } = useSelector((state: RootState) => state.ChatSlice)

  const { messages, activeMediaMessage } = useSelector((state: RootState) => state.GallerySlice)
  console.log("🚀 ~ messages:", messages)

  const chatMediaMessages = useCallback(() => messages.find(messages => messages.chat_id === id), [id, messages])()

  return chatMediaMessages?.mediaMessages ? (
    <Suspense fallback={<>Loading...</>}>
      <div ref={ref} className='flex overflow-y-scroll scrollbar w-full justify-center py-[8px] gap-2 place-items-center h-full px-2'>
        {Array.from(chatMediaMessages.mediaMessages).map((message) => {
          return <div key={message?.id}><CarouselItem data={message} url={message.url as string} active={activeMediaMessage?.id === message?.id} /></div>
        })}
      </div>
    </Suspense>
  ) : null
}

export default forwardRef(GalleryFooterCarousel)
