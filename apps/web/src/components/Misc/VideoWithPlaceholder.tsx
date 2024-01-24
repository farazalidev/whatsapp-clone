import Image from 'next/image'
import React, { FC, useState } from 'react'

interface IVideoWithPlaceholder {
  videoUrl: string | null
  thumbnailUrl: string | null
  isLoading: boolean
}

const VideoWithPlaceholder: FC<IVideoWithPlaceholder> = ({ videoUrl, isLoading }) => {

  const [showPlaceholder, setShowPlaceholder] = useState(true)

  const handlePlay = () => {
    setShowPlaceholder(false)
  }

  return showPlaceholder ? (

    <span className='h-full w-full bg-gray-400 flex justify-center place-items-center' >
      {isLoading ? <Image src={'/icons/loading.svg'} height={30} width={30} alt='loading' /> : <Image src={'/icons/play.svg'} height={30} width={30} alt='play' onClick={handlePlay} />}

    </span>
  ) : (
    <span>
      <video src={videoUrl as string} controls ></video>
    </span>
  )
}

export default VideoWithPlaceholder
