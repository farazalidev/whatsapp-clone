import React, { useEffect, useState } from 'react';
import FormLayout from './FormLayout';
import Upload from '@/Atoms/Input/Upload';
import Input from '@/Atoms/Input/Input';
import Button from '@/Atoms/Button/Button';
import { useForm } from 'react-hook-form';
import { CompleteProfileType } from '@/schema/authSchema';
import { redirect } from 'next/navigation';
import Typography from '@/Atoms/Typography/Typography';
import { useCompleteProfileMutation, useUploadProfilePicMutation } from '@/global/apis/AuthApi';

const CompleteProfile = () => {
  const [
    uploadImage,
    {
      isSuccess: profilePicIsSuccess,
      data: profilePicData,
      isLoading: profilePicIsLoading,
      isError: profilePicIsError,
      error: profilePicError,
    },
  ] = useUploadProfilePicMutation();

  const [
    completeProfile,
    {
      isLoading: CompleteProfileIsLoading,
      isSuccess: CompleteProfileIsSuccess,
      isError: CompleteProfileIsError,
      error: CompleteProfileError,
    },
  ] = useCompleteProfileMutation();

  const [image, setImage] = useState<File | undefined>(undefined);

  const [profileData, setProfileData] = useState<CompleteProfileType>({ about: '', name: '' });

  // redirection user
  useEffect(() => {
    if (CompleteProfileIsSuccess) {
      redirect('/user');
    }
  }, [CompleteProfileIsSuccess]);

  // handling profile completion
  useEffect(() => {
    const completeProfileHandler = async () => {
      console.log(profilePicData);

      await completeProfile({
        about: profileData.about,
        name: profileData.about,
        profile_pic: { format: profilePicData?.data?.format as string, public_id: profilePicData?.data?.public_id as string },
      });
    };

    if (profilePicIsSuccess) {
      completeProfileHandler();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilePicIsSuccess]);

  // handling image
  const handleImage = (image: File) => {
    setImage(image);
  };

  const { register, handleSubmit } = useForm<CompleteProfileType>({});

  const submitHandler = async (data: CompleteProfileType) => {
    setProfileData(data);
    const fmData = new FormData();
    fmData.append('profile_pic', image as any);
    await uploadProfilePic(fmData);

    if (profilePicIsSuccess) {
      await completeProfile({
        about: data.about,
        name: data.name,
        profile_pic: { format: profilePicData?.data?.format as string, public_id: profilePicData?.data?.public_id as string },
      });
    }
  };

  const uploadProfilePic = async (fmData: FormData) => {
    await uploadImage(fmData);
  };

  return (
    <FormLayout className="relative dark:text-white grid-cols-none flex flex-col w-full justify-center place-items-center h-fit">
      <Typography className="absolute top-4 left-4" level={5}>
        Complete Profile
      </Typography>
      <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col place-items-center gap-2">
        {profilePicIsError ? <Typography text_style={'error'}>{(profilePicError as any)?.data.message}</Typography> : null}
        {CompleteProfileIsError ? <Typography text_style={'error'}>{(CompleteProfileError as any)?.data.message}</Typography> : null}

        <div className="w-[60%] flex flex-col place-items-center justify-center">
          <Upload size={'lg'} getImage={handleImage} isLoading={profilePicIsLoading} />
          <div className="flex flex-col gap-2">
            <Input placeholder="Enter Name" inputsize={'medium'} label="Name" {...register('name')} />
            <Input placeholder="About" inputsize={'medium'} label="About" {...register('about')} />
            <Button size={'md'} type="submit" loading={CompleteProfileIsLoading} disabled={profilePicIsLoading || CompleteProfileIsLoading}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </FormLayout>
  );
};

export default CompleteProfile;
