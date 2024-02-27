import Typography from '@/Atoms/Typography/Typography'
import { RootState } from '@/global/store'
import { clampString } from '@/utils/clamp'
import React from 'react'
import { useSelector } from 'react-redux'

const ProfilePreviewAbout = () => {

    const { chat_receiver } = useSelector((state: RootState) => state.ChatSlice)

    return (
        <div className='flex py-4 flex-col dark:bg-whatsapp-dark-primary_bg px-10 bg-whatsapp-light-primary_bg'>
            <Typography className='opacity-60'>About</Typography>
            <Typography level={3} className='text-white'>{clampString(chat_receiver?.profile?.about || '', 25)}</Typography>
        </div>
    )
}

export default ProfilePreviewAbout
