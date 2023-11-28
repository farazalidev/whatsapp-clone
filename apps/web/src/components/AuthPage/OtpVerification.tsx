import React, { useEffect, useState } from 'react';
import FormLayout from './FormLayout';
import Typography from '@/Atoms/Typography/Typography';
import OtpInput from '@/Atoms/Input/OtpInput';
import Button from '@/Atoms/Button/Button';
import { useVerifyUserMutation } from '@/global/apis/AuthApi';
import { useRouter } from 'next/navigation';

const OtpVerification = () => {
  const router = useRouter();
  const [verifyUser, { isError, isLoading, isSuccess, error, data }] = useVerifyUserMutation();

  const [otpValue, setOtpValue] = useState<string>('');

  const handleValues = (otp: string) => {
    setOtpValue(otp);
  };

  const handleVerify = async () => {
    await verifyUser({ registration_otp: otpValue });
  };

  useEffect(() => {
    if (isSuccess) {
      const timeoutId = setTimeout(() => {
        router.push('/user');
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [isSuccess]);

  return (
    <FormLayout className='dark:text-white lg:grid-cols-none flex w-full lg:place-items-center justify-center '>
      <div className='md:border-[2px] w-[500px] h-[300px] p-5 mt-[30%] md:shadow-lg rounded-md lg:mt-0 '>
        <Typography level={5} bold className='mb-4'>
          Verify your Account
          {isError ? <Typography text_style={'error'}>{(error as any)?.data?.message}</Typography> : null}
          {isSuccess ? <Typography text_style={'success'}>{data?.successMessage}</Typography> : null}
        </Typography>
        <Typography className='w-full mb-4'>
          Please Enter code that has been sended to your mail <strong className='text-right'>farazalidev@gmail.com</strong> to complete the
          Registration.
        </Typography>
        <OtpInput getValue={handleValues} />
        <Button color_variant={'primary'} type='submit' size={'lg'} className='w-full mt-4' onClick={handleVerify} loading={isLoading}>
          verify
        </Button>
      </div>
    </FormLayout>
  );
};

export default OtpVerification;
