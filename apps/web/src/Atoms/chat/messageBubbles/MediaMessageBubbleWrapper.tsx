'use client'
import React, { FC, ReactNode } from 'react'
import { expectedFileTypes } from '@shared/types'

interface IMediaMessageWrapper {
  children: ReactNode
  isFromMe: boolean | undefined
  messageType: expectedFileTypes | "text" | undefined
}

const MediaMessageBubbleWrapper: FC<IMediaMessageWrapper> = ({ isFromMe, messageType, children }) => {
  return (
    <span className={`relative flex h-[350px] w-[320px] max-w-[80%] justify-between rounded-md px-2 py-1 lg:max-w-[40%] border-[4px]  ${isFromMe
      ? 'border-whatsapp-misc-my_message_bg_light dark:border-whatsapp-misc-my_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
      : 'border-whatsapp-misc-other_message_bg_light dark:border-whatsapp-misc-other_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
      } ${messageType === "svg" ? "bg-white" : ""}`}>{children}</span>
  )
}

export default MediaMessageBubbleWrapper
