import React, { FC, useEffect, useState } from 'react'
import GalleryHeader from './GalleryHeader'
import GalleryBody from './GalleryBody'
import GalleryFooter from './GalleryFooter'
import { fetcher } from '@/utils/fetcher'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/global/store'
import Image from 'next/image'
import { MessageMediaEntity } from '@server/modules/chat/entities/messageMedia.entity'
import { addThumbnails } from '@/global/features/GallerySlice'
import useCurrentChat from '@/hooks/useCurrentChat'


interface IGalleryOverlay {
  show: boolean
  onClose: () => void
}

export interface IMediaThumbnail { media: MessageMediaEntity | null, url: string }

const GalleryOverlay: FC<IGalleryOverlay> = ({ onClose, show }) => {

  const { id } = useSelector((state: RootState) => state.ChatSlice)
  const [state, setState] = useState<{ loading: boolean, error: boolean }>({ error: false, loading: true })
  const { Me } = useSelector((state: RootState) => state.UserSlice)
  const { raw_chat } = useCurrentChat()
  const { chats } = useSelector((state: RootState) => state.messagesSlice)

  const dispatch = useDispatch()

  // fetching all media of the chat
  useEffect(() => {
    const getAllMediaOfChat = async () => {
      try {
        const messages = raw_chat?.messages.filter(message => message.messageType === "video" || message.messageType === "image" || message.messageType === "svg")
        if (messages) {
          // Sort messages in ascending order based on 'sended_at'
          messages.sort((a, b) => new Date(a.sended_at).getTime() - new Date(b.sended_at).getTime());

          // fetching all the thumbnails of the media
          const mediaThumbnails: IMediaThumbnail[] = []
          for (let i = 0; i < messages.length; i++) {

            const thumbnailBlob = await fetcher(`api/file/get-attachment/${Me?.user_id}/${messages[i]?.media?.path}-thumbnail/.png`, undefined, "blob", "static")
            const url = URL.createObjectURL(thumbnailBlob)
            mediaThumbnails.push({ media: messages[i].media, url })
          }
          dispatch(addThumbnails({ thumbnails: mediaThumbnails }))
        }

      } catch (error) {
        setState(prev => { return { ...prev, error: true } })
      } finally {
        setState(prev => { return { ...prev, loading: false } })
      }
    }
    if (id) {
      getAllMediaOfChat()
    }
  }, [Me?.user_id, id, dispatch, chats, raw_chat?.messages])


  return show ? (
    <div className='text-white h-full w-full bg-whatsapp-dark-primary_bg bg-opacity-95 absolute inset-0 z-40 flex flex-col' >
      {state.loading ? <div className='h-full w-full flex justify-center place-items-center'><Image src={'/icons/spinner.svg'} alt='loading' height={50} width={50} /></div> :
        <>
          <GalleryHeader onClose={onClose} />
          <GalleryBody />
          <GalleryFooter />
        </>
      }
    </div>
  ) : null
}

export default GalleryOverlay
