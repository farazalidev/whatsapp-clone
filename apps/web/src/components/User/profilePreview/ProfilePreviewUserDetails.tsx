import React, { FC } from 'react'
import Avatar from '../Avatar'
import Typography from '@/Atoms/Typography/Typography'
import { useSelector } from 'react-redux'
import { RootState } from '@/global/store'

interface IProfilePreviewUserDetails {
}

const ProfilePreviewUserDetails: FC<IProfilePreviewUserDetails> = () => {

    const { chat_receiver } = useSelector((state: RootState) => state.ChatSlice)

    return (
        <div className='flex gap-3 w-full justify-center place-items-center flex-col py-6 bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-primary_bg'>
            <Avatar height={200} width={200} user_id={chat_receiver?.user_id || undefined} />
            <div className='flex justify-center place-items-center flex-col'>
                <Typography level={5}>{chat_receiver?.name || ""}</Typography>
                <Typography className='opacity-50 text-white text-sm'>{chat_receiver?.profile?.about}</Typography>
            </div>
        </div>
    )
}

export default ProfilePreviewUserDetails
