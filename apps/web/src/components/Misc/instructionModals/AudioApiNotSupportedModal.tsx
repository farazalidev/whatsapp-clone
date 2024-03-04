/* eslint-disable react/no-unescaped-entities */
import Button from '@/Atoms/Button/Button'
import Typography from '@/Atoms/Typography/Typography'
import { closeInstructionModal } from '@/global/features/ModalSlice'
import { store } from '@/global/store'
import React from 'react'

const AudioApiNotSupportedModal = () => {
    const handleClose = () => {
        store.dispatch(closeInstructionModal())
    }

    return (
        <div className='dark:bg-whatsapp-misc-device_not_found_modal_bg  bg-white rounded-sm w-[452px]'>
            <div className='flex flex-col py-[22px] px-[24px]'>
                <div>
                    <Typography level={4} className='mb-5 text-whatsapp-light-text dark:text-whatsapp-dark-text text-opacity-80 dark:text-opacity-80'>
                        Audio device not supported
                    </Typography>
                    <Typography className='mb-5 text-whatsapp-light-text dark:text-whatsapp-dark-text text-opacity-80 dark:text-opacity-80'>
                        Your current browser does not support audio devices. Please use Updated Browser or use updated Chrome browser for more efficient messaging.
                    </Typography>
                </div>
                <div className='flex justify-end' onClick={handleClose}>
                    <Button size={"md"}>Ok, got it</Button>
                </div>
            </div>

        </div>
    )
}

export default AudioApiNotSupportedModal
