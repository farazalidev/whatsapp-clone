import React, { FC, useEffect, useState } from 'react'
import GalleryHeader from './GalleryHeader'
import GalleryBody from './GalleryBody'
import GalleryFooter from './GalleryFooter'
import { fetcher } from '@/utils/fetcher'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/global/store'
import Image from 'next/image'
import { MessageMediaEntity } from '@server/modules/chat/entities/messageMedia.entity'
import { MessageEntityGalleryExtended, addThumbnails } from '@/global/features/GallerySlice'
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
  const { receiver_id } = useSelector((state: RootState) => state.ChatSlice)

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
          const mediaThumbnails: MessageEntityGalleryExtended[] = []

          for (let i = 0; i < messages.length; i++) {
            const user_id = messages[i].from.user_id === Me?.user_id ? Me.user_id : receiver_id
            const ext = messages[i].messageType === "video" ? '.png' : messages[i].media?.ext
            const pathUrl = messages[i].media?.mime.startsWith('image/svg') ? `api/file/get-attachment/${user_id}/${messages[i].media?.id}` : `api/file/get-attachment-thumbnail/${user_id}/${messages[i].media?.id}/sm`
            const thumbnailBlob = await fetcher(pathUrl, undefined, "blob", "static", { ext })
            const url = URL.createObjectURL(thumbnailBlob)
            mediaThumbnails.push({ ...messages[i], url })
          }
          console.log(mediaThumbnails);

          dispatch(addThumbnails({ messages: mediaThumbnails }))
        }


      } catch (error) {
        console.log("🚀 ~ getAllMediaOfChat ~ error:", error)
        setState(prev => { return { ...prev, error: true } })
      } finally {
        setState(prev => { return { ...prev, loading: false } })
      }
    }
    if (id) {
      getAllMediaOfChat()
    }
  }, [Me?.user_id, id, dispatch, raw_chat?.messages])


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
