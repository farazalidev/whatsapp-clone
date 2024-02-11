import React, { FC, } from 'react'
import GalleryFooterCarousel from './GalleryFooterCarousel'

interface IGalleryFooter {
}

const GalleryFooter: FC<IGalleryFooter> = () => {


  return (
    <div className='h-[110px] border-t-[1px] border-gray-300 dark:border-gray-600'>
      <GalleryFooterCarousel />
    </div>
  )
}

export default GalleryFooter
