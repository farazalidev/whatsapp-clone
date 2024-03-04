import React, { FC, useEffect, useState } from 'react';
import GalleryHeader from './GalleryHeader';
import GalleryBody from './GalleryBody';
import GalleryFooter from './GalleryFooter';
import { fetcher } from '@/utils/fetcher';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/global/store';
import Image from 'next/image';
import { MessageMediaEntity } from '@server/modules/chat/entities/messageMedia.entity';
import { MessageEntityGalleryExtended, addThumbnails } from '@/global/features/GallerySlice';

interface IGalleryOverlay {
  show: boolean;
  onClose: () => void;
}

export interface IMediaThumbnail {
  media: MessageMediaEntity | null;
  url: string;
}

const GalleryOverlay: FC<IGalleryOverlay> = ({ onClose, show }) => {
  const { id } = useSelector((state: RootState) => state.ChatSlice);
  const [state, setState] = useState<{ loading: boolean; error: boolean }>({ error: false, loading: true });
  const { Me } = useSelector((state: RootState) => state.UserSlice);
  const { receiver_id } = useSelector((state: RootState) => state.ChatSlice);

  const dispatch = useDispatch();

  // fetching all media of the chat
  useEffect(() => {
    const getAllMediaOfChat = async () => {
      try {
        // todo fetch the media from another api
        // Sort messages in ascending order based on 'sended_at'

          // fetching all the thumbnails of the media
        const mediaThumbnails: MessageEntityGalleryExtended[] = [];

        const mediaMessagesPathUrl = `chat/get-all-media-messages/${id}`;
        const messages = await fetcher<MessageMediaEntity[]>(mediaMessagesPathUrl, undefined, 'json', 'primary');

        for (let i = 0; i < messages.length; i++) {

          const ext = messages[i]?.type === 'video' ? '.png' : messages[i]?.ext

          const pathUrl = messages[i]?.mime.startsWith('image/svg')
            ? `api/file/get-attachment/${messages[i]?.path}`
            : `api/file/get-attachment-thumbnail/${messages[i].path}/sm`;

          const thumbnailBlob = await fetcher(pathUrl, undefined, 'blob', 'static', { ext });

          const url = URL.createObjectURL(thumbnailBlob);
          mediaThumbnails.push({ ...messages[i], url });
        }

        dispatch(addThumbnails({ chat_id: id as string, messages: mediaThumbnails }));
      } catch (error) {
        setState((prev) => {
          return { ...prev, error: true };
        });
      } finally {
        setState((prev) => {
          return { ...prev, loading: false };
        });
      }
    };
    if (id) {
      getAllMediaOfChat();
    }
  }, [Me?.user_id, id, dispatch, receiver_id]);

  return show ? (
    <div className="dark:bg-whatsapp-dark-primary_bg bg-whatsapp-light-secondary_gray absolute inset-0 z-40 flex h-full w-full flex-col bg-opacity-95 text-white">
      {state.loading ? (
        <div className="flex h-full w-full place-items-center justify-center">
          <Image src={'/icons/spinner.svg'} alt="loading" height={50} width={50} />
        </div>
      ) : (
        <>
          <GalleryHeader onClose={onClose} />
          <GalleryBody />
          <GalleryFooter />
        </>
      )}
    </div>
  ) : null;
};

export default GalleryOverlay;
