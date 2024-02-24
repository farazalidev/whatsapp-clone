import React, { useState } from 'react';
import FormLayout from './FormLayout';
import Upload from '@/Atoms/Input/Upload';
import Input from '@/Atoms/Input/Input';
import Button from '@/Atoms/Button/Button';
import { useForm } from 'react-hook-form';
import { CompleteProfileType } from '@/schema/authSchema';
import Typography from '@/Atoms/Typography/Typography';
import { Mutation, fetcher } from '@/utils/fetcher';
import { toast } from 'sonner';
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

  const { register, handleSubmit } = useForm<CompleteProfileType>({
    defaultValues: {
      about: "Hey, i am using whatsapp."
    }
  });

  const submitHandler = async (data: CompleteProfileType) => {
    const fmData = new FormData();
    fmData.append('profile-pic', image as any);

    // uploading profile pic
    await Mutation<FormData, { file_path: string }>('api/file/upload/profile-pic', fmData, 'static')
      .then(async (profile_pic) => {
        setIsLoading(true);
        toast.success('profile pic uploaded');
        await Mutation('user/complete-profile', { about: data.about })
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

  const handleSkip = async () => {
    try {
      setIsLoading(true)
      await fetcher('/auth/skip-profile')
      router.push('/user')
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormLayout className="relative flex h-fit w-full grid-cols-none flex-col place-items-center justify-center dark:text-white">
      <Typography className="absolute left-4 top-4" level={5}>
        Complete Profile
      </Typography>
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col place-items-center gap-2">
        <div className="flex w-[60%] flex-col place-items-center justify-center">
          <Upload size={'lg'} getImage={handleImage} isLoading={isLoading} />
          <div className="flex flex-col gap-2">
            <Input placeholder="Tell something about you" inputsize={'medium'} label="About" {...register('about')} />
            <div className='flex justify-between'>
            <Button size={'md'} type="submit" loading={isLoading} disabled={isLoading}>
              Save
            </Button>
              <Button color_variant={"secondary"} size={'md'} type='button' onClick={handleSkip} disabled={isLoading} loading={isLoading}>
                Skip
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormLayout>
  );
};

export default CompleteProfile;
