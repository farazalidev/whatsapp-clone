import React, { useEffect, useState } from 'react';
import FormLayout from './FormLayout';
import Typography from '@/Atoms/Typography/Typography';
import OtpInput from '@/Atoms/Input/OtpInput';
import Button from '@/Atoms/Button/Button';
import { Mutation, fetcher } from '@/utils/fetcher';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import FallBackLoadingSpinner from '@/Atoms/Loading/FallBackLoadingSpinner';
import { useRouter } from 'next/navigation';

const OtpVerification = () => {
  const [otpValue, setOtpValue] = useState<string>('');

  const [isLoading, setIsLoading] = useState(true);

  const [userEmail, setUserEmail] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const response = await fetcher<{ email: string }>('/auth/user-email')
        setUserEmail(response.email)
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false)
      }
    }
    getUserEmail()
  }, [])

  const handleValues = (otp: string) => {
    setOtpValue(otp);
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      await Mutation('auth/verify-user', { registration_otp: otpValue })
      setTimeout(() => {
        router.push("/user")
      }, 1500)
      toast.success('Verification successful');
    } catch (error) {
      toast.error((error as AxiosError<{ message: string }>).response?.data.message || 'Failed to verify');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout className="dark:text-white lg:grid-cols-none flex w-full lg:place-items-center justify-center ">
      {isLoading ? <FallBackLoadingSpinner /> :
        <div className="md:border-[2px] w-[500px] h-[300px] p-5 mt-[30%] md:shadow-lg rounded-md lg:mt-0 ">
          <Typography level={5} bold className="mb-4">
            Verify your Account
          </Typography>
          <Typography className="w-full mb-4">
            Please Enter code that has been sended to your mail <strong className="text-right">{userEmail}</strong> to complete the
            Registration.
          </Typography>
          <OtpInput getValue={handleValues} />
          <Button color_variant={'primary'} type="submit" size={'lg'} className="w-full mt-4" onClick={handleVerify} loading={isLoading}>
            verify
          </Button>
        </div>}
    </FormLayout>
  );
};

export default OtpVerification;
