import { cn } from '@/utils/cn';
import { VariantProps, cva } from 'class-variance-authority';
import Image from 'next/image';
import React, { ChangeEvent, FC, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import Typography from '../Typography/Typography';

interface UploadAtomProps
  extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
    VariantProps<typeof uploadAtomVariants> {
  getImage: (image: File) => void;
  isLoading: boolean;
  label?: string;
}

const uploadAtomVariants = cva('border-[2px] border-black dark:border-white flex place-items-center justify-center', {
  variants: {
    layout: {
      rounded: 'rounded-full',
      square: 'rounded-none',
    },
    size: {
      sm: 'w-32 h-32 lg:w-40 lg:h-40',
      md: 'w-56 h-56 lg:w-72 lg:h-72',
      lg: 'w-72 h-72 lg:w-80 lg:h-80',
    },
  },
  defaultVariants: {
    layout: 'rounded',
    size: 'md',
  },
});

const Upload: FC<UploadAtomProps> = ({ layout, className, getImage, isLoading, label }) => {
  const [imageSrc, setImageSrc] = useState<File | undefined>(undefined);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpg' || e.target.files[0].type === 'image/jpeg') {
        setImageSrc(e.target.files[0]);
        return getImage(e.target.files[0]);
      }
      alert('Please select .png, .jpg, or .jpeg format');
    }
  };

  return (
    <div>
      <Typography level={3}>{label}</Typography>
      <div className={cn('group relative overflow-hidden', uploadAtomVariants({ layout, className }))}>
        <Image src={imageSrc ? URL.createObjectURL(imageSrc as File) : '/icons/avatardefault.svg'} fill alt="avatar" />
        <span
          className={`absolute w-full h-full bg-gray-700 bg-opacity-50 ${
            !isLoading ? 'invisible' : ''
          } group-hover:visible flex place-items-center justify-center`}
        >
          {!isLoading ? (
            <label htmlFor="file" className="cursor-pointer">
              <MdEdit size={35} title="Edit" />
            </label>
          ) : (
            'Uploading...'
          )}
        </span>
      </div>
      <input type="file" id="file" className="hidden" accept=".png, .jpeg, .jpg" onChange={handleInputChange} />
    </div>
  );
};

export default Upload;
