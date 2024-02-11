import React, { FC } from 'react'
import OptionIcon from '../Sidebar/OptionIcon'
import Avatar from '../Avatar'
import { useSelector } from 'react-redux'
import { RootState } from '@/global/store'
import dayjs from 'dayjs'
import { MessageEntity } from '@server/modules/chat/entities/message.entity'

interface IGalleryHeader {
  onClose: () => void
}

const GalleryHeader: FC<IGalleryHeader> = ({ onClose }) => {

  const { activeMediaMessage } = useSelector((state: RootState) => state.GallerySlice)

  const { receiver_id } = useSelector((state: RootState) => state.ChatSlice)

  const { Me } = useSelector((state: RootState) => state.UserSlice)

  const onDownload = (message: MessageEntity | null | undefined) => {
    const user_id = message?.from.user_id === Me?.user_id ? Me?.user_id : receiver_id
    const downloadLink = `api/file/attachment-download/${user_id}/${message?.media?.id}`;
    const link = document.createElement('a');
    link.href = downloadLink;
    link.click();
  }

  return (
    <div className='h-[60px] w-full flex place-items-center justify-between px-[13px]'>
      {/* message info */}
      <div className='h-[60px] flex place-items-center'>
        <div className='flex gap-[13px] place-items-center'>
          <Avatar height={40} width={40} className='' user_id={activeMediaMessage?.from.user_id} />
          <div className='flex flex-col gap-1'>
            <span className='text-sm  text-gray-300'>
              {activeMediaMessage?.from.name}
            </span>
            <span className='text-xs  dark:text-gray-400'>{activeMediaMessage?.sended_at ? dayjs(activeMediaMessage.sended_at).format('MM/DD/YYYY  hh:mm A') : ''}</span>
          </div>

        </div>

      </div>

      {/* actions */}
      <div className='flex place-items-center justify-between gap-2'>
        <OptionIcon src='/icons/gallery-icons/bubble.svg' height={40} width={40} className='p-[8px]' tooltip='Go to the message' />
        <OptionIcon src='/icons/gallery-icons/star-btn.svg' height={40} width={40} className='p-[8px]' tooltip='Star' />
        <OptionIcon src='/icons/gallery-icons/pinned3.svg' height={40} width={40} className='p-[8px]' tooltip='Pin' />
        <OptionIcon src='/icons/gallery-icons/reactions-media.svg' height={40} width={40} className='p-[8px]' tooltip='React' />
        <OptionIcon src='/icons/gallery-icons/forward.svg' height={40} width={40} className='p-[8px]' tooltip='Forward' />
        <OptionIcon src='/icons/gallery-icons/download.svg' height={40} width={40} className='p-[8px]' tooltip='Download' onClick={() => onDownload(activeMediaMessage)} />
        <OptionIcon src='/icons/gallery-icons/x-viewer.svg' height={40} width={40} className='p-[8px]' onClick={onClose} tooltip='Close' />
      </div>
    </div>
  )
}

export default GalleryHeader
