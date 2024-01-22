import Image from 'next/image'
import React, { FC } from 'react'

interface ISendedMessagesButton extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  count: number
}


const SendMediaMessagesButton: FC<ISendedMessagesButton> = ({ count = 0, ...props }) => {
  return (
    <button className='rounded-full h-[50px] w-[50px] bg-whatsapp-misc-whatsapp_primary_green_light relative justify-center place-items-center flex' {...props}>
      <span className="w-7 h-7 rounded-full bg-white border-2 border-white absolute top-0.5 -right-2 text-xs flex justify-center place-items-center">{count > 99 ? "99+" : count}</span>
      <Image src={'/icons/send.svg'} width={30} height={30} alt='send' className='absolute ' />
    </button>
  )
}

export default SendMediaMessagesButton
