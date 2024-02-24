'use client';
import Button from '@/Atoms/Button/Button';
import Input from '@/Atoms/Input/Input';
import Typography from '@/Atoms/Typography/Typography';
import { LoginSchema, LoginSchemaType } from '@/schema/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormLayout from './FormLayout';
import { Mutation } from '@/utils/fetcher';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { getCookie } from '@/utils/getCookie';
import { jwtDecode } from 'jwt-decode';
import OtpVerification from './OtpVerification';


export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [shouldOpenOtpScreen, setShouldOpenOtpScreen] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const otpToken = getCookie(process.env.NEXT_PUBLIC_OTP_TOKEN_NAME)
    if (otpToken) {
      const decodedToken = jwtDecode(otpToken)
      if (decodedToken.exp && Number(decodedToken?.exp).toFixed(0) > (Date.now() / 1000).toFixed(0)) {
        setShouldOpenOtpScreen(true)
      }

    }
  }, [])

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const handleLogin = async (data: LoginSchemaType) => {
    try {
      setIsLoading(true);
      await Mutation('auth/login', data)
      setShouldOpenOtpScreen(true)
      toast.success('Login successful', { position: 'top-right', duration: 1800 });
    } catch (error) {
      toast.error(((error as AxiosError<{ message: string }>).response?.data.message as string) || 'Login failed', {
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return shouldOpenOtpScreen ? <OtpVerification /> : (
    <FormLayout className="flex justify-center">
      {/* Login */}
      <form
        className="relative p-4 w-full md:w-[80%] justify-center place-items-center mx-auto h-full mt-0 md:mt-10 flex flex-col gap-2 bg-opacity-0"
        onSubmit={handleSubmit(handleLogin)}
      >
        <Typography level={5}>
          Enter Your Email
        </Typography>
        <Typography level={2} className='mb-4'>
          By entering your email, you can login or signUp
        </Typography>

          <Input
            inputsize={'large'}
            placeholder="Enter Your Email"
            type="email"
          full_width
            {...register('email')}
            error={errors.email?.message ? true : false}
            error_message={errors.email?.message}
        />
        <Button color_variant={'primary'} size={'lg'} className="mt-1 px-4" type="submit" loading={isLoading}>
          Next
        </Button>
      </form>
    </FormLayout>
  );
};
