import React, { useState } from 'react';
import FormLayout from './FormLayout';
import Upload from '@/Atoms/Input/Upload';
import Input from '@/Atoms/Input/Input';
import Button from '@/Atoms/Button/Button';
import { useForm } from 'react-hook-form';
import { CompleteProfileType } from '@/schema/authSchema';
import Typography from '@/Atoms/Typography/Typography';
import { Mutation } from '@/utils/fetcher';
import { toast } from 'sonner';
import { CompleteProfileBody } from '../../global/apis/api.types';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

const CompleteProfile = () => {
  const router = useRouter();

  const [image, setImage] = useState<File | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);

  // handling image
  const handleImage = (image: File) => {
    setImage(image);
  };

  const { register, handleSubmit } = useForm<CompleteProfileType>({});

  const submitHandler = async (data: CompleteProfileType) => {
    const fmData = new FormData();
    fmData.append('profile_pic', image as any);

    // uploading profile pic
    await Mutation<FormData, { file_path: string }>('file/upload/profile-pic', fmData)
      .then(async (profile_pic) => {
        setIsLoading(true);
        toast.success('profile pic uploaded');
        await Mutation<CompleteProfileBody>('user/complete-profile', { pic_path: profile_pic.file_path, about: data.about })
          .then(() => {
            toast.success('Profile completion successful');
            setTimeout(() => {
              router.push('/user');
            }, 1500);
          })
          .catch((error) => {
            toast.error((error as AxiosError<{ message: string }>).response?.data.message || 'Failed to save profile');
          });
      })
      .catch((error) => {
        toast.error((error as AxiosError<{ message: string }>).response?.data.message || 'Failed to upload profile Pic');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <FormLayout className="relative flex h-fit w-full grid-cols-none flex-col place-items-center justify-center dark:text-white">
      <Typography className="absolute left-4 top-4" level={5}>
        Complete Profile
      </Typography>
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col place-items-center gap-2">
        <div className="flex w-[60%] flex-col place-items-center justify-center">
          <Upload size={'lg'} getImage={handleImage} isLoading={isLoading} />
          <div className="flex flex-col gap-2">
            <Input placeholder="About" inputsize={'medium'} label="About" {...register('about')} />
            <Button size={'md'} type="submit" loading={isLoading} disabled={isLoading}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </FormLayout>
  );
};

export default CompleteProfile;
