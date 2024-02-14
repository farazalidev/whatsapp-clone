import React from 'react'
import OptionIcon from '../Sidebar/OptionIcon'
import Typography from '@/Atoms/Typography/Typography'

const ProfilePreviewOptions = () => {
    return (
        // Starred messages
        <div className='bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-primary_bg px-10'>
            <div className='flex justify-between place-items-center py-4'>
                <span className='flex place-items-center gap-2'>
                    <OptionIcon src='/icons/star.svg' />
                    <Typography>Starred messages</Typography>
                </span>
                <OptionIcon src='/icons/down.svg' className='-rotate-90' />
            </div>

            {/* Disappearing messages */}
            <div className='flex flex-col place-items-start py-4'>
                <span className='flex place-items-center gap-2 justify-between w-full'>
                    <div className='flex gap-2'>
                        <OptionIcon src='/icons/disappearing.svg' />
                        <Typography>Disappearing messages</Typography>
                    </div>
                    <OptionIcon src='/icons/down.svg' className='-rotate-90' />
                </span>
                <Typography className='opacity-50 ml-8'>Off</Typography>
            </div>

            {/* Encryption */}
            <div className='flex flex-col place-items-start py-4'>
                <span className='flex place-items-center gap-2 justify-between w-full'>
                    <div className='flex gap-2'>
                        <OptionIcon src='/icons/lock-enc.svg' />
                        <Typography>Encryption</Typography>
                    </div>
                </span>
                <Typography className='opacity-50 ml-8 whitespace-nowrap text-sm'>Messages are end-to-end encrypted. Click to verify.</Typography>
            </div>

            {/* Delete */}
            <div className='flex flex-col place-items-start py-4'>
                <span className='flex place-items-center gap-2 justify-between w-full'>
                    <div className='flex gap-2'>
                        <OptionIcon src='/icons/delete.svg' />
                        <Typography className='dark:text-whatsapp-misc-delete_red text-whatsapp-misc-delete_red'>Delete chat</Typography>
                    </div>
                </span>
            </div>
        </div>
    )
}

export default ProfilePreviewOptions
