import Typography from '@/Atoms/Typography/Typography'
import { useUserChatDetails } from '@/hooks/useGetChatDetails'
import { clampString } from '@/utils/clamp'
import React from 'react'

const ProfilePreviewAbout = () => {
    const { receiver } = useUserChatDetails()


    return (
        <div className='flex py-4 flex-col dark:bg-whatsapp-dark-primary_bg px-10 bg-whatsapp-light-primary_bg'>
            <Typography className='opacity-60'>About</Typography>
            <Typography level={3} className='text-white'>{clampString(receiver?.profile?.about || '', 25)}</Typography>
        </div>
    )
}

export default ProfilePreviewAbout
