'use client'
import React, { FC, ReactNode } from 'react'
import { expectedFileTypes } from '@shared/types'
import { cn } from '@/utils/cn'

interface IMediaMessageWrapper extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  children: ReactNode
  isFromMe: boolean | undefined
  messageType: expectedFileTypes | "text" | undefined
  height?: number
  width?: number
}

const MediaMessageBubbleWrapper: FC<IMediaMessageWrapper> = ({ isFromMe, messageType, height, width, children, ...props }) => {

  return (
    <span style={{ height: height, minHeight: height || 300, width: width, minWidth: width || 300, maxWidth: width, maxHeight: height }} {...props} className={cn([`relative flex rounded-md overflow-hidden border-[3px] bg-gray-300 ${isFromMe
      ? 'border-whatsapp-misc-my_message_bg_light dark:border-whatsapp-misc-my_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
      : 'border-whatsapp-misc-other_message_bg_light dark:border-whatsapp-misc-other_message_bg_dark dark:text-whatsapp-dark-text text-whatsapp-light-text'
      } ${messageType === "svg" ? "bg-gray-300" : ""}`, props.className])} >
      {messageType === "svg" ? <div className='absolute w-full h-full inset-0 mix-blend-exclusion'></div> : null}
      {children}</span>
  )
}

export default MediaMessageBubbleWrapper
