import Image from 'next/image'
import React, { FC } from 'react'

interface IAddNewFileButton extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
}

const AddNewFileButton: FC<IAddNewFileButton> = ({ ...props }) => {
  return (
    <>
      <input type="file" multiple {...props} className='hidden' id='add-file' />
      <label htmlFor="add-file" className='flex place-items-center justify-center h-[50px] w-[50px] rounded-md border border-gray-300 dark:border-gray-600 left_box_shadow cursor-pointer'>
        <Image src={'/icons/attach-menu-plus.svg'} height={30} width={30} alt='add file' />
      </label>
    </>
  )
}

export default AddNewFileButton
