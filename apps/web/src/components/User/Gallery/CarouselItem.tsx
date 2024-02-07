import React, { FC } from 'react'
import Image from 'next/image'
import { cn } from '@/utils/cn'
import { MessageMediaEntity } from '@server/modules/chat/entities/messageMedia.entity'
import { useDispatch } from 'react-redux'
import { setActiveGalleryMedia } from '@/global/features/GallerySlice'

interface ICarousalItemProps {
  data: MessageMediaEntity | null
  url: string
  active: boolean
}

const CarouselItem: FC<ICarousalItemProps> = ({ active = false, url, data }) => {

  const dispatch = useDispatch()

  const handleActiveMedia = (id: string | undefined) => {
    if (id) {
      dispatch(setActiveGalleryMedia(id))
    }
  }

  return (
    <div className={cn(['bg-gray-50 text-white w-[78px] h-[78px] flex-shrink-0 flex-grow-0  relative rounded-md border-[5px] border-whatsapp-light-secondary_bg cursor-pointer dark:border-whatsapp-dark-secondary_bg transition-all', active ? 'w-[65px] h-[65px] border-gray-300 dark:border-gray-500' : ""])} onClick={() => handleActiveMedia(data?.id)}>
      <Image src={url || '/placeholders/placholder-image.png'} fill objectFit='cover' alt='thumbnail' />
    </div>
  )
}

export default CarouselItem
