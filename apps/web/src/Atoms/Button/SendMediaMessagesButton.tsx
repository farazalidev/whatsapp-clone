import Image from 'next/image'
import React, { FC } from 'react'

interface ISendedMessagesButton extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  count: number
  isLoading: boolean
}


const SendMediaMessagesButton: FC<ISendedMessagesButton> = ({ count = 0, isLoading, ...props }) => {
  return (
    <button className='rounded-full h-[60px] w-[60px] bg-whatsapp-misc-whatsapp_primary_green_light relative justify-center place-items-center flex disabled:cursor-not-allowed' {...props} disabled={isLoading}>
      <span className="w-[26px] h-[26px] rounded-full bg-white border-2 border-white absolute top-0.5 -right-2 text-xs flex justify-center place-items-center">{count > 99 ? "99+" : count}</span>
      {isLoading ? <Image src={'/icons/spinner.svg'} height={30} width={30} alt='loading' /> :
        <Image src={'/icons/send.svg'} width={30} height={30} alt='send' className='absolute ' />
      }
    </button>
  )
}

export default SendMediaMessagesButton
