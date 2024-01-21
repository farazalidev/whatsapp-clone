import Image from 'next/image'
import React, { FC } from 'react'

interface ISendedMessagesButton {
  count: number
}


const SendMediaMessagesButton: FC<ISendedMessagesButton> = ({ count = 0 }) => {
  return (
    <div className='rounded-full h-[60px] w-[60px] bg-whatsapp-misc-whatsapp_primary_green_light relative justify-center place-items-center flex'>
      <span className="w-7 h-7 rounded-full bg-white border-2 border-white absolute top-0.5 -right-2 text-xs flex justify-center place-items-center">{count > 99 ? "99+" : count}</span>
      <Image src={'/icons/send.svg'} width={30} height={30} alt='send' className='absolute ' />
    </div>
  )
}

export default SendMediaMessagesButton
